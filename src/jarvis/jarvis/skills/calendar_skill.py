import semantic_kernel as sk
from semantic_kernel.skill_definition.sk_function_decorator import sk_function
from semantic_kernel.skill_definition.sk_function_context_parameter_decorator import sk_function_context_parameter

import requests
import json


class CalendarSkill:
    GRAPH_BASE_URL = "https://graph.microsoft.com/v1.0/me"

    @sk_function(description="run this function if the user asks for it's calendar events or schedule.")
    async def get_calendar_events(self, context: sk.SKContext) -> str:
        """Get calendar events from the MSFT Graph API"""

        print("Creating filter...")
        event_func = context.skills.get_function(
            "CalendarSemanticSkill", "SemanticTimeToGraphFilter")
        filters = await event_func.invoke_with_vars_async(input=context.variables)
        filters = json.loads(filters.result)
        print(f"filters: {filters}")

        # store the filters in the context so that we can use them later
        filter = filters["filters"][0]
        context.variables["filters"] = filter

        url = f"{self.GRAPH_BASE_URL}/events?{filter}"

        print(f"Getting calendar events from: {url}...")
        headers = self._get_headers(context)
        retrieved_events = requests.get(
            url=url, headers=headers).json()
        formatted_events = self._format_events(retrieved_events)
        print(f"formatted events: {formatted_events}")

        return json.dumps(formatted_events)

    @sk_function(description="run this function if the user asks for suitable meeting times")
    @sk_function_context_parameter(name="user_input", description="The user input")
    @sk_function_context_parameter(name="filters", description="Graph API filters to use based on the semantic input provided by the user.")
    async def propose_meeting_times_based_on_calendar_events(self, context: sk.SKContext) -> str:
        """Get calendar events from the MSFT Graph API"""

        formatted_events = await self.get_calendar_events(context=context)

        if context.variables.get("filters") is None:
            return "Ask the question when the user wants to schedule a meeting. Tell the user that no date/time context was given."

        context.variables["calendar_events"] = formatted_events
        event_func = context.skills.get_function(
            "CalendarSemanticSkill", "ProposeMeetingTimes")
        suitable_meeting_times = await event_func.invoke_with_vars_async(input=context.variables)
        return suitable_meeting_times.result

    @sk_function(description="run this function if a user asks to create a meeting in the user's calendar.")
    @sk_function_context_parameter(name="user_input", description="The user input")
    @sk_function_context_parameter(name="chat_history", description="The historical dialogue between the chatbot and the user.")
    async def create_calendar_event(self, context: sk.SKContext) -> str:
        format_meeting_func = context.skills.get_function(
            "CalendarSemanticSkill", "FormatMeetingForCalendarEvent")

        print(f"formatting meeting results...")
        for n_tries in range(3):
            meeting = await format_meeting_func.invoke_with_vars_async(input=context.variables)
            try:
                print(f"Trying for times: {n_tries}. result: {meeting.result}")
                context.variables["chat_history"] += meeting.result
                print("Loading to json...")
                meeting = json.loads(meeting.result)
                print("Done...")
                break
            except:
                return "Couldn't parse data."

        print(f"formatted meeting result: {meeting}")

        meeting = self.create_graph_event(meeting)

        headers = self._get_headers(context)

        print("Creating meeting...")
        created_meeting = requests.post(
            url=f"{self.GRAPH_BASE_URL}/events",
            headers=headers,
            json=meeting
        ).json()
        print("Done...")

        try:
            formatted_meeting = {
                "subject": created_meeting["subject"],
                "start": created_meeting["start"]["dateTime"],
                "end": created_meeting["end"]["dateTime"]
            }
        except:
            print("Could not format meeting")
            print(created_meeting)
            formatted_meeting = {}

        return f"Created the following meeting: {json.dumps(formatted_meeting)}"

    @staticmethod
    def create_graph_event(meeting):
        return {
            "subject": meeting.get("subject"),
            "body": {
                "contentType": "HTML",
                "content": meeting.get("body", "Meeting created by COPILOT")
            },
            "start": {
                "dateTime": meeting.get("start"),
                "timeZone": "UTC"
            },
            "end": {
                "dateTime": meeting.get("end"),
                "timeZone": "UTC"
            },
        }

    def _format_events(self, events):
        formatted_events = []

        events = events.get("value", [])

        for event in events:
            formatted_event = {
                "subject": event["subject"],
                "start": event["start"]["dateTime"],
                "end": event["end"]["dateTime"]
            }
            formatted_events.append(formatted_event)
        return formatted_events

    @staticmethod
    def _get_headers(context: sk.SKContext):
        return {
            "Authorization": "Bearer " + context.variables["token"],
            "Content-Type": "application/json"
        }

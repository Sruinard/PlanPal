import semantic_kernel as sk
from semantic_kernel.skill_definition.sk_function_decorator import sk_function

import requests
import json


class CalendarSkill:
    GRAPH_BASE_URL = "https://graph.microsoft.com/v1.0/me"

    @sk_function(description="Filter events based on a date range")
    async def get_calendar_events(self, context: sk.SKContext) -> str:
        """Get calendar events from the MSFT Graph API"""

        variables = context.variables
        event_func = context.skills.get_function("Calendar", "events_filter")

        filters = await event_func.invoke_with_vars_async(input=variables)
        print(filters.result)
        filters = json.loads(filters.result)
        url = f"{self.GRAPH_BASE_URL}?{filters['filters'][0]}"
        headers = self._get_headers(context)
        retrieved_events = requests.get(url=url, headers=headers).json()
        formatted_events = self._format_events(retrieved_events)
        print(formatted_events)

        return json.dumps(formatted_events)

    @sk_function(description="Propose meeting times based on a list of events and the current time")
    async def propose_meeting_time(self, context: sk.SKContext) -> str:
        event_func = context.skills.get_function("Calendar", "events_proposal")

        suitable_meeting_times = await event_func.invoke_with_vars_async(input=context.variables)
        return suitable_meeting_times.result

    @sk_function(description="Create a calendar event")
    async def create_calendar_event(self, context: sk.SKContext) -> str:
        format_meeting_func = context.skills.get_function(
            "Calendar", "format_meeting")

        meeting = await format_meeting_func.invoke_with_vars_async(input=context.variables)
        meeting = json.loads(meeting.result)

        meeting = self.create_graph_event(meeting)

        headers = self._get_headers(context)
        created_meeting = requests.post(
            url=self.GRAPH_BASE_URL,
            headers=headers,
            json=meeting
        ).json()

        formatted_meeting = {
            "subject": created_meeting["subject"],
            "start": created_meeting["start"]["dateTime"],
            "end": created_meeting["end"]["dateTime"]
        }

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

        events = events["value"]

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

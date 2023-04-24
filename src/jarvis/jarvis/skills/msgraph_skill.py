import msal
from semantic_kernel.skill_definition import sk_function
import requests
import json

class CalendarSkill:

    def __init__(self, client_id, client_secret, tenant_id):
        self.client_id = client_id
        self.client_secret = client_secret
        self.tenant_id = tenant_id

    def get_access_token(self):
        user_access_token = "EwBgA8l6BAAUAOyDv0l6PcCVu89kmzvqZmkWABkAAcy/nzbgVX1ugSb98H11NPEkrZzzLE0rpvrqu5SNE7UOfae+vr5Bia8Z1bjWOlZL5PFgidWd5lKXB5dGxzoJNyxvLrwom44HUOasxc+6CqlAH2TkZ31Xk7vPkxs1aUPnQRl9ccRatBYBlme/LrdILqey0SN4GYODoeWdkdCAbub2ydHswmTP0RiSZXMOJXzdek3MyEkA0q90gQIz/oO38UTrFtwTDZkMExXKnARdjM/r4zvvczcsFtkG2TWNJQuFsXcj9tJPqcp7DtbIgxO1QpZXKxwHkwnvVJ1Ti48Di1CPv1tyV0oWzZVqvOH2tX/5mmsllcmnf/3rFjyBnRCmQZIDZgAACHgJFXAJ0kLSMAJ4BjMPp8hd2mg4BoRQEg91Sb/2WeJgrU40zIa0n/TZ0EVfiWbkqo5xsxZWlZbQO2TfH9PIC8UZA+6X6oS/3KFiB0HdySNMOLy8JXyTUkFxpiCvTWGp7BWchBKxnRVcOzM2kf6VbV+Ms6Qa3GXcjwVIsdsK8wtQ53uAuffvcMCKQM1ZYIuZbEcygdLSK9pbsDJs7uEWmIb1YPYxoI2cLerDfZf/LE7q5XWWKTCBJYxcM+PggQ5Wrg2tsNVLDCLaOPPBq+8H8YeZTCNbyLLX0+R238Xmf1s08aRSE534yNvbmNhzWHiuQlh4UOP2u7Z+AdgEFOQCzsPlvwQTVAfPpit6RrglvZJ/6ZhhR5hWlYucVurjWSKfEd+pD/OysEMTkr6eT5PU3OMYWxqAleiQub+92TpWUjt2E8oSElMbjEAHt4HAn15C9/9YKoMaoJ0DnW3qkTA0pRFMn4WfFff6iL0i566Pm+E9n1vZ7gvx4Pk9Ny65nwit/ZDudNAy4MKNJvKC/0dsXUy8ju8uu5JUvdEHIv4NxyvApiQ3+3zEJDPjE6bAWC+mSUNObN3NwqF9H6tI1nuGhFrz4D5OROyx4ZdfPPiFIuJ1cUzpAnVtzPbePS3pG61cfuVn8qE2Hsdk2f/Ggsbiz0o0AjZzmyB9EUp1+SpwRf9aWn2VLzc3HOaFPhuTmxi20XxYa43WtT+lJPh5dwIiDfwacqtE4vP1AdKK+ADerx5BeF58Qhtc0cb3m3IC"
        app = msal.ConfidentialClientApplication(
            self.client_id,
            authority="https://login.microsoftonline.com/" + self.tenant_id,
            client_credential=self.client_secret
        )
        result = app.acquire_token_for_client(scopes=["https://graph.microsoft.com/.default"],
                                              )

        result = app.acquire_token_on_behalf_of(
        scopes=['https://graph.microsoft.com/.default'],
        user_assertion=result['access_token']
    )
        return result["access_token"]
    
    def get_events(self, token, start_date, end_date):
        headers = {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        }
        url = "https://graph.microsoft.com/v1.0/me/calendarview?startdatetime={}&enddatetime={}".format(start_date, end_date)
        response = requests.get(url, headers=headers)
        return json.loads(response.text)

    @sk_function(description="Get calendar events for a given date range")
    def get_calendar_events(self, start_date, end_date):
        # Get the access token
        token = self.get_access_token()
        # Get the calendar events
        events = self.get_events(token, start_date, end_date)
        return events

    @sk_function(description="Add a calendar event")
    def add_calendar_event(self, subject, start_date, end_date):
        # Get the access token
        token = self.get_access_token()
        # add an entry to the calendar
        headers = {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        }
        url = "https://graph.microsoft.com/v1.0/me/events"
        data = {
            "subject": subject,
            "start": {
                "dateTime": start_date,
                "timeZone": "UTC"
            },
            "end": {
                "dateTime": end_date,
                "timeZone": "UTC"
            }
        }
        response = requests.post(url, headers=headers, data=json.dumps(data))
        return json.loads(response.text)

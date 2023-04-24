import msal
import os
from dotenv import load_dotenv

load_dotenv()

from jarvis.skills.msgraph_skill import CalendarSkill

def test_get_access_token():
    client_id = os.getenv("CLIENT_ID")
    client_secret = os.getenv("CLIENT_SECRET")
    tenant_id = os.getenv("TENANT_ID")
    skill = CalendarSkill(client_id=client_id, client_secret=client_secret, tenant_id=tenant_id)
    token = skill.get_access_token()
    assert token is not None

def test_calendar_skill_can_retrieve_events():
    client_id = os.getenv("CLIENT_ID")
    client_secret = os.getenv("CLIENT_SECRET")
    tenant_id = os.getenv("TENANT_ID")
    skill = CalendarSkill(client_id=client_id, client_secret=client_secret, tenant_id=tenant_id)
    events = skill.get_calendar_events(start_date="2020-01-01", end_date="2020-01-31")
    assert events is not None

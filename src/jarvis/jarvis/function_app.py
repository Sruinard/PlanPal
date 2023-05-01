import azure.functions as func
import os
import json
import logging
import requests
from dotenv import load_dotenv

# load environment variables

load_dotenv()


import config

app = func.FunctionApp()


@app.function_name(name="ping")
@app.route(route="ping")  # HTTP Trigger
def ping_invoke(req: func.HttpRequest) -> func.HttpResponse:
    return func.HttpResponse(
        "Hello, My name is Jarvis and I'm here to help you drive more eco-friendly."
    )


@app.function_name(name="jarvis")
@app.route(route="kernel")  # HTTP Trigger
def kernel_invoke(req: func.HttpRequest) -> func.HttpResponse:
    token = req.headers.get("Authorization", "No token found")
    msft_graph_url = f"https://graph.microsoft.com/v1.0/me/events"

    # # create a header with the access token and content type
    # headers = {
    #     "Authorization": "Bearer " + token,
    #     "Content-Type": "application/json"
    # }

    # out = requests.get(
    #     url=msft_graph_url,
    #     headers=headers

    # )
    # retrieved_events = out.json()
    # retrieved_events
    return func.HttpResponse(
        f"Succesfully connected to the kernel. endpoint: {config.JarvisConfig.AZURE_OPENAI_ENDPOINT}, token: {token}"
    )


@app.function_name(name="speech")
@app.route(route="speech")  # HTTP Trigger
def test_function(req: func.HttpRequest) -> func.HttpResponse:
    logging.info("Python HTTP trigger function processed a request.")

    speech_key = os.environ["SPEECH_KEY"]
    service_region = os.environ["SERVICE_REGION"]

    headers = {
        "Ocp-Apim-Subscription-Key": speech_key,
        "Content-Type": "application/x-www-form-urlencoded",
    }

    response = requests.post(
        url=f"https://{service_region}.api.cognitive.microsoft.com/sts/v1.0/issuetoken",
        headers=headers,
    )

    if response.status_code != 200:
        raise Exception(
            "Received unexpected status code {}, exiting.".format(response.status_code)
        )
    
    access_token = str(response.text)

    return func.HttpResponse(
        json.dumps({
            "access_token": access_token,
            "token_type": "Bearer",
            "region": service_region,
        }),
        mimetype="application/json",
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
    )

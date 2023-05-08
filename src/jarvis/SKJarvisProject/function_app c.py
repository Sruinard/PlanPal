import config
import azure.functions as func
import os
import json
import logging
import requests
from dotenv import load_dotenv
import copilot_kernel as ck
from semantic_kernel.ai.open_ai import AzureTextCompletion
import semantic_kernel as sk

import logging

logging.basicConfig(level=logging.INFO)

LOGGER = logging.getLogger(__name__)

# kernel = sk.Kernel()

deployment, api_key, endpoint = sk.azure_openai_settings_from_dot_env()

# kernel.config.add_text_backend(
#     "dv", AzureTextCompletion(deployment, endpoint, api_key))

# load environment variables

load_dotenv()

kernel = ck.get_kernel()
ck.init_kernel_with_functions(kernel)
context = kernel.create_new_context()


app = func.FunctionApp()


@app.function_name(name="ping")
@app.route(route="ping")  # HTTP Trigger
def ping_invoke(req: func.HttpRequest) -> func.HttpResponse:
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Credentials": "true",
    }
    return func.HttpResponse(
        # json response openai
        json.dumps(
            {
                "message": "Hello, My name is Jarvis and I'm here to help you drive more eco-friendly."
            }
        ),
        mimetype="application/json",
        headers=headers,
    )


@app.function_name(name="jarvis")
@app.route(route="kernel")  # HTTP Trigger
async def kernel_invoke(req: func.HttpRequest) -> func.HttpResponse:
    # token = req.params.get("token", "No token found")
    token = req.headers.get("Authorization", "No token found").split(" ")[1]
    # get user input from body
    user_input = req.get_json().get("user_input", "No user input found")
    context.variables["token"] = token
    LOGGER.info(token)
    answer, _ = await ck.chat(user_input=user_input, context=context)

    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": "true",
    }

    return func.HttpResponse(
        # json response openai
        json.dumps({"message": answer}),
        mimetype="application/json",
        headers=headers,
    )


@app.function_name(name="config")
@app.route(route="config")  # HTTP Trigger
def config(req: func.HttpRequest) -> func.HttpResponse:
    is_key_present = "Key is not present"
    if os.environ.get("AZURE_OPENAI_API_KEY", "") != "":
        is_key_present = "Key is present"
    return func.HttpResponse(
        # json response openai
        json.dumps(
            {
                "AZURE_OPENAI_API_KEY": is_key_present,
                "AZURE_OPENAI_ENDPOINT": os.environ.get(
                    "AZURE_OPENAI_ENDPOINT", "No endpoint found"
                ),
                "AZURE_OPENAI_DEPLOYMENT_NAME": os.environ.get(
                    "AZURE_OPENAI_DEPLOYMENT_NAME", "No deployment name found"
                ),
            }
        ),
        mimetype="application/json",
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
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
        json.dumps(
            {
                "access_token": access_token,
                "token_type": "Bearer",
                "region": service_region,
            }
        ),
        mimetype="application/json",
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
    )

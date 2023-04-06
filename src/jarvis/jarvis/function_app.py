import azure.functions as func
import os
import logging

import config

app = func.FunctionApp()


@app.function_name(name="ping")
@app.route(route="ping")  # HTTP Trigger
def test_function(req: func.HttpRequest) -> func.HttpResponse:
    return func.HttpResponse("Hello, My name is Jarvis and I'm here to help you drive more eco-friendly.")


@app.function_name(name="jarvis")
@app.route(route="kernel")  # HTTP Trigger
def test_function(req: func.HttpRequest) -> func.HttpResponse:
    return func.HttpResponse(f"Succesfully connected to the kernel. endpoint: {config.JarvisConfig.AZURE_OPENAI_ENDPOINT}")


@app.function_name(name="HttpTrigger1")
@app.route(route="hello")
def test_function(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    name = req.params.get('name')
    if not name:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            name = req_body.get('name')

    if name:
        return func.HttpResponse(f"Hello, {name}. This HTTP triggered function executed successfully.")
    else:
        return func.HttpResponse(
            "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.",
            status_code=200
        )

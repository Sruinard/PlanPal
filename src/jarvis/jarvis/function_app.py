import azure.functions as func

app = func.FunctionApp()


@app.function_name(name="ping")
@app.route(route="hello")  # HTTP Trigger
def test_function(req: func.HttpRequest) -> func.HttpResponse:
    return func.HttpResponse("Hello, My name is Jarvis and I'm here to help you drive more eco-friendly.")


@app.function_name(name="jarvis")
@app.route(route="kernel")  # HTTP Trigger
def test_function(req: func.HttpRequest) -> func.HttpResponse:
    return func.HttpResponse("Succesfully connected to the kernel.")

import os


class JarvisConfig:

    AZURE_OPENAI_ENDPOINT = os.environ.get(
        "AZURE_OPENAI_ENDPOINT", "Env Vars not loaded.")

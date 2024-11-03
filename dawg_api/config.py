import os


class CONFIG:
    debug = os.getenv("DEBUG") == "true"

    if debug:
        mongo_uri = os.getenv("DEBUG_MONGO_URI")
        # redis_host = os.getenv("DEBUG_REDIS_HOST")
        # redis_port = os.getenv("DEBUG_REDIS_PORT")
        # redis_password = os.getenv("DEBUG_REDIS_PASSWORD")

    else:
        mongo_uri = os.getenv("MONGO_URI")
        # redis_host = os.getenv("REDIS_HOST")
        # redis_port = os.getenv("REDIS_PORT")
        # redis_password = os.getenv("REDIS_PASSWORD")

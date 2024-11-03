from fastapi.requests import Request

from datetime import datetime, date

from config import CONFIG


import aioredis


def get_redis():
    return aioredis.Redis(
        host=CONFIG.redis_host, port=CONFIG.redis_port, password=CONFIG.redis_password
    )


def json_serial(obj):
    """JSON serializer for objects not serializable by default json code"""

    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    raise TypeError("Type %s not serializable" % type(obj))

import os

CONSTANTS = {
    "FDA_URL" : os.getenv('FDA_URL'),
    "REDIS_URL" : os.getenv('REDIS_URL'),
    "REDIS_PORT" : os.getenv('REDIS_PORT'),
    "REDIS_PASSWORD" : os.getenv('REDIS_PASSWORD'),
    "REDIS_DB": os.getenv('REDIS_DB'),
    "REDIS_KEYS_LIMIT" : 20,
    "IN_DOCKER": os.getenv('IN_DOCKER')
}
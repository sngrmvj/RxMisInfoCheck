
from flask import Response
import json


def custom_response(res, status_code):
    return Response(
        mimetype="application/json",
        response=json.dumps(res),
        status=status_code
    )


def singleton(class_):
    instances = {}
    def getInstance(*args, **kwargs):
        if class_ not in instances:
            instances[class_] = class_(*args, **kwargs)
        return instances[class_]
    return getInstance


""" 
# NOTE - To be remembered
# The decorator can be applied to class and function. 
# If the kind of functionality you want to extend using decorator should be
# applied for both class and function. We can extend it for class and function.
"""
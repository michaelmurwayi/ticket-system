
from rest_framework.response import Response


def success_response(
    data=None,
    message="Request completed successfully.",
    status_code=200,
    meta=None,
):
    body = {
        "success": True,
        "message": message,
        "data": data,
    }

    if meta is not None:
        body["meta"] = meta

    return Response(body, status=status_code)


def error_response(
    message="The request could not be completed.",
    errors=None,
    status_code=400,
):
    return Response(
        {
            "success": False,
            "message": message,
            "errors": errors or {},
            "data": None,
        },
        status=status_code,
    )

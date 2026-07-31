from fastapi import Request
from fastapi.responses import JSONResponse

from tc_auth.exceptions.error import AuthError


async def auth_exception_handler(
    request: Request,
    exc: AuthError,
):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": str(exc),
        },
    )
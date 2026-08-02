import time
import jwt
from tc_auth.exceptions.error import InvalidTokenError

from tc_auth.config import (
    SECRET_KEY,
    ALGORITHM,
    SESSION_DURATION_DAYS,
)


def create_access_token(data: dict) -> str:
    payload = data.copy()
    payload["exp"] = (
        int(time.time())
        + (SESSION_DURATION_DAYS * 24 * 60 * 60)
    )

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM,
    )


def verify_token(token: str) -> dict:
    try:
        return jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )
    except Exception:
        raise InvalidTokenError(field="token", value=token)

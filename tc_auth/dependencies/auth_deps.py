from datetime import UTC, datetime

from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from tc_auth.exceptions.error import InvalidTokenError
from tc_auth.jwt.tokens import verify_token
from tc_auth.utils.hasher import verify_hash

security_jwt = HTTPBearer()


class AuthDeps:
    def __init__(self, get_user, session):
        self.get_user = get_user
        self.session = session

    def _authenticate(
        self,
        token: str,
    ):
        payload = verify_token(token)

        session = self.session.by_id(
            payload["sid"]
        )

        if session["account_id"] != payload["aid"]:
            raise InvalidTokenError(field="account_id")

        if session["expires_at"] < datetime.now(UTC):
            raise InvalidTokenError(field="session")

        if not verify_hash(
            payload["st"],
            session["token_hash"],
        ):
            raise InvalidTokenError(field="token")

        return payload, session

    def get_current_user(
        self,
        credentials: HTTPAuthorizationCredentials = Depends(security_jwt),
    ):
        payload, _ = self._authenticate(
            credentials.credentials
        )

        return self.get_user.by_id(
            payload["aid"]
        )

    def get_current_session(
        self,
        credentials: HTTPAuthorizationCredentials = Depends(security_jwt),
    ):
        payload, session = self._authenticate(
            credentials.credentials
        )

        user = self.get_current_user(
            credentials
        )

        return {
            **user,
            "session": session,
        }
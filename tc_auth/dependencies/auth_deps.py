from datetime import UTC, datetime

from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from tc_auth.exceptions.error import InvalidTokenError
from tc_auth.jwt_handler import verify_token
from tc_auth.utils.hasher import verify_hash

security_jwt = HTTPBearer()


class AuthDeps:
    def __init__(self, get_user, session):
        self.get_user = get_user
        self.session = session

    # ==========================================================
    # PRIVATE
    # ==========================================================

    def _authenticate(
        self,
        token: str,
    ):
        payload = verify_token(token)

        session = self.session.by_id(
            payload["sid"]
        )

        if session is None:
            raise InvalidTokenError(field="session")

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

    # ==========================================================
    # CURRENT
    # ==========================================================

    def get_current(
        self,
        credentials: HTTPAuthorizationCredentials = Depends(security_jwt),
    ):
        payload, session = self._authenticate(
            credentials.credentials
        )

        account = self.get_user.by_id(
            payload["aid"]
        )

        return {
            "account": account,
            "session": session,
            "payload": payload,
        }

    # ==========================================================
    # HELPERS
    # ==========================================================

    def get_current_account(
        self,
        current=Depends(get_current),
    ):
        return current["account"]

    def get_current_session(
        self,
        current=Depends(get_current),
    ):
        return current["session"]

    def get_current_payload(
        self,
        current=Depends(get_current),
    ):
        return current["payload"]
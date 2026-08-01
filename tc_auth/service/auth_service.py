from tc_auth.jwt.tokens import create_access_token , verify_token
from tc_auth.exceptions.error import InvalidTokenError
from tc_auth.utils.hasher import verify_hash


class AuthService:
    def __init__(
        self,
        get_user,
        account,
        session,
    ):
        self.get_user = get_user
        self.account = account
        self.session = session

    def signup(
        self,
        name: str,
        email: str,
        password: str,
        handle: str | None = None,
        phone: str | None = None,
        role: str | None = None,
        status: str | None = None,
        ip_address: str | None = None,
        user_agent: str | None = None,
    ):
        account = self.account.create_user(
            name=name,
            email=email,
            password=password,
            handle=handle,
            phone=phone,
            role=role,
            status=status,
        )

        session = self.session.create_session(
            account_id=account["id"],
            ip_address=ip_address,
            user_agent=user_agent,
        )

        access_token = create_access_token(
            {
                "aid": account["id"],
                "sid": session["session_id"],
                "token": session["token"],
            }
        )

        return {
            "access_token": access_token,
            "token_type": "Bearer",
            "account": account,
        }
    
    def authenticate_session(
        self,
        token: str,
    ):
        payload = verify_token(token)

        session = self.session.by_id(
            payload["sid"]
        )

        if session["account_id"] != payload["aid"]:
            raise InvalidTokenError(field="account_id")

        if not verify_hash(
            payload["st"],
            session["token_hash"],
        ):
            raise InvalidTokenError(field="token")

        return self.get_user.by_id(
            payload["aid"]
        )
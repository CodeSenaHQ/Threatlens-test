from tc_auth.jwt_handler  import create_access_token, verify_token
from tc_auth.utils.hasher import verify_password
from tc_auth.utils.identifier import (
    normalize_identifier,
    get_identifier_type,
)
from tc_auth.exceptions.error import (
    InvalidCredentialsError,
    UserNotFoundError,
)


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

    def _create_login_response(
        self,
        account: dict,
        ip_address: str | None,
        user_agent: str | None,
    ):
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

    def _authenticate(
        self,
        identifier: str,
        password: str,
    ):
        identifier = normalize_identifier(identifier)

        try:
            if get_identifier_type(identifier) == "email":
                account = self.get_user.by_email(
                    identifier,
                    include_password=True,
                )
            else:
                account = self.get_user.by_handle(
                    identifier,
                    include_password=True,
                )

        except UserNotFoundError:
            raise InvalidCredentialsError()

        if not verify_password(
            password,
            account["password_hash"],
        ):
            raise InvalidCredentialsError()

        account.pop("password_hash", None)

        return account

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

        return self._create_login_response(
            account,
            ip_address,
            user_agent,
        )

    def login(
        self,
        identifier: str,
        password: str,
        ip_address: str | None = None,
        user_agent: str | None = None,
    ):
        account = self._authenticate(
            identifier,
            password,
        )

        return self._create_login_response(
            account,
            ip_address,
            user_agent,
        )
    
    def logout(
        self,
        access_token: str,
    ):
        payload = verify_token(
            access_token
        )

        self.session.destroy_session(
            payload["sid"]
        )

    def logout_all(
        self,
        access_token: str,
    ):
        payload = verify_token(
            access_token
        )

        self.session.destroy_all(
            payload["aid"]
        )
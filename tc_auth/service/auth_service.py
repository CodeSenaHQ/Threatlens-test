from fastapi import APIRouter, Request


class AuthRoutes:
    def __init__(
        self,
        app,
        email_service,
        auth_service,
        otp_service,
        get_user,
    ):
        self.email_service = email_service
        self.auth_service = auth_service
        self.otp_service = otp_service
        self.get_user = get_user

        router = APIRouter()

        router.post("/send/email/otp/{purpose}")(self.send_email_otp)

        router.post("/signup/otp")(self.signup_with_otp)
        router.post("/login/otp")(self.login_with_otp)
        router.post("/login/password")(self.login_with_password)

        app.include_router(router)

    # ==========================================================
    # EMAIL OTP
    # ==========================================================

    def send_email_otp(
        self,
        purpose: str,
        email: str,
    ):
        return self.email_service.send_otp(
            email=email,
            purpose=purpose,
        )

    # ==========================================================
    # SIGNUP
    # ==========================================================

    def signup_with_otp(
        self,
        request: Request,
        otp: str,
        email: str,
        password: str,
        name: str,
        handle: str | None = None,
    ):
        self.otp_service.verify(
            identifier=email,
            purpose="signup",
            otp=otp,
        )

        return self.auth_service.signup(
            name=name,
            email=email,
            password=password,
            handle=handle,
            **self._request_meta(request),
        )

    # ==========================================================
    # LOGIN
    # ==========================================================

    def login_with_otp(
        self,
        request: Request,
        otp: str,
        email: str,
    ):
        self.otp_service.verify(
            identifier=email,
            purpose="login",
            otp=otp,
        )

        account = self.get_user.by_email(email=email)

        return self.auth_service.create_login_response(
            account=account,
            **self._request_meta(request),
        )

    def login_with_password(
        self,
        request: Request,
        identifier: str,
        password: str,
    ):
        return self.auth_service.login(
            identifier=identifier,
            password=password,
            **self._request_meta(request),
        )

    # ==========================================================
    # PRIVATE
    # ==========================================================

    def _request_meta(
        self,
        request: Request,
    ):
        return {
            "ip_address": request.client.host,
            "user_agent": request.headers.get("user-agent", ""),
        }
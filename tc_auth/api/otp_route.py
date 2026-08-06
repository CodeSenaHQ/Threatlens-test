from fastapi import APIRouter

class AuthRoutes:
    def __init__(self, app, email_service, otp_service):
        self.email_service = email_service
        self.otp_service = otp_service

        router = APIRouter()

        router.post("/send/email/otp")(self.send_email_otp)
        router.post("/login")(self.login)

        app.include_router(router)

    def send_email_otp(self, email: str):
        if not self.email_service.send_login_otp(email=email):
            return {"error": "Failed to send OTP"}
        return {"status": "success"}

    def login(self):
        return self.auth.service.login()

    def logout(self):
        return self.auth.service.logout()

    def logout_all(self):
        return self.auth.service.logout_all()

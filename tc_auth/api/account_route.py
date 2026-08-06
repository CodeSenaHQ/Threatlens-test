from fastapi import APIRouter , Depends


class AccountRoutes:
    def __init__(self, app, auth_service, account_service, otp_service, deps):
        self.app = app
        self.auth_service = auth_service
        self.account_service = account_service
        self.otp_service = otp_service
        self.router = APIRouter()

        self.router.post("/logout")(self.logout_route)

        app.include_router(self.router)

    def logout_route(self,  user =  Depends(self.deps.get_current)):
        self.deps.get_current_user()
        self.deps.get_current_account()
        self.auth_service.logout()
        return {"message": "Logout successful"}

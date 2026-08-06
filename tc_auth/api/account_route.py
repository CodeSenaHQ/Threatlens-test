from fastapi import APIRouter , Depends

class AccountRoutes:
    def __init__(self, app, session_service, account_service, deps):
        self.app = app
        self.session_service = session_service
        self.account_service = account_service
        self.deps = deps

        self.router = APIRouter()
        self.register()
        self.app.include_router(self.router)

    def register(self):
        current = Depends(self.deps.get_current)

        @self.router.post("/logout")
        def logout(user=current):
            return self.session_service.destroy_session(user["session"]["id"])

        @self.router.post("/logout-all")
        def logout_all(user=current):
            return self.session_service.destroy_all(user["account"]["id"])

        @self.router.get("/me")
        def me(user=current):
            return user
        
        @self.router.put("/update/password")
        def update_password(body: dict, user=current):
            return self.account_service.update_password(account_id=user["account"]["id"], password=body["password"])

    # ==========================================================

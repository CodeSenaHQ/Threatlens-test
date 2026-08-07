from fastapi import APIRouter , Depends
from tc_auth.schema.oauth import (
    CreateOAuth,
    DeleteOAuth,
)

class DashOAuthRoutes:
    def __init__(self, app,  oauth_service, role_deps):
        self.oauth_service = oauth_service  
        self.role_deps = role_deps

        self.router = APIRouter()
        self.register()
        app.include_router(self.router, prefix="/tc-auth/oauth", tags=["OAuth ops"])

    def register(self):
        current = Depends(self.role_deps.require("superadmin"))

        @self.router.get("/")
        def get_account(user=current):
            return self.oauth_service.get_all_oauth_links()
        
        @self.router.post("/")
        def create(body : CreateOAuth , user=current):
            return self.oauth_service.link_account(**body.model_dump())


        @self.router.delete("/")
        def delete(body : DeleteOAuth, user=current):
            return self.oauth_service.unlink_account(**body.model_dump())
        

    # ==========================================================

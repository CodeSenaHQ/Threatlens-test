from fastapi import APIRouter , Depends
from tc_auth.schema.otp import (
    CreateOTP,
    DeleteOTP,
)

class DashOTPRoutes:
    def __init__(self, app,  otp_service, role_deps):
        self.otp_service = otp_service
        self.role_deps = role_deps

        self.router = APIRouter()
        self.register()
        app.include_router(self.router, prefix="/tc-auth/otp", tags=["OTP ops"])

    def register(self):
        current = Depends(self.role_deps.require("superadmin"))

        @self.router.get("/")
        def get_otps(user=current):
            return self.otp_service.get_all()
        
        @self.router.post("/")
        def create_otp(body : CreateOTP , user=current):
            return self.otp_service.create(**body.model_dump())

        @self.router.delete("/")
        def delete_otp(body : DeleteOTP, user=current):    
            return self.otp_service.revoke(**body.model_dump())
        
        @self.router.delete("/cleanup")
        def cleanup(user=current):
            return self.otp_service.cleanup()
        
        @self.router.delete("/clear")
        def clear(user=current):
            return self.otp_service.clear_all()

        
    # ==========================================================

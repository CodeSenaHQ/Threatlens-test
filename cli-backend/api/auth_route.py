from fastapi import APIRouter
from fastapi.responses import RedirectResponse
from ..config import config
from ..service.auth_service import oauth_callback , password_login

router = APIRouter()

@router.get("/{provider}/login")
def oauth_login(provider):
    return RedirectResponse(
        f"{config.BASE_URL}/{provider}/login"
        "?frontend_url=http://localhost:1234"
    )

@router.get("/oauth/callback")
def callback(access_token: str):
    return oauth_callback(access_token=access_token)

@router.post("password/login")
def pass_login():
   return password_login()

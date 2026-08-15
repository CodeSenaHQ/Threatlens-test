import httpx 
from fastapi import APIRouter
from fastapi.exceptions import HTTPException
from ..connect import app
from ..config import config

router = APIRouter(app)

def password_login(identifier: str, password: str) -> dict : 
    response = httpx.post(
        f"{config.BASE_URL}/login/password",
        json={
            "identifier": identifier,
            "password": password
        }
    )

    data = response.json().get("access_token")
    if not data :
        raise HTTPException(detail="login failed" , status_code=400)
    print(data)

    return {"status": "logged in"}



def oauth_callback(access_token: str):
    if not access_token:
        raise HTTPException(detail="unable to verify account", status_code=400)
    print(access_token)
    return {"status": "logged in"}
from config import config
from fastapi import HTTPException
import httpx
from db import get_jwt

def chk_state():
    response = httpx.get(
        f"{config.AUTH_BASE_URL}/me",
        headers={
            "Authorization": f"Bearer {get_jwt()}",
            }
        
    )
    return response.json()


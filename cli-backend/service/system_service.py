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


def get_global_limit():
    M = 1_000_000

    return {
        "prompt_tokens": M,
        "completion_tokens": M * 4,
        "total_tokens": M * 4,
    }
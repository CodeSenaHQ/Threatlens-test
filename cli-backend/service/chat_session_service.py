import httpx
from fastapi import HTTPException
from config import config
from db import get_jwt


def _get_headers(token: str | None = None) -> dict:
    jwt_val = token or get_jwt()
    if jwt_val:
        return {"Authorization": f"Bearer {jwt_val}"}
    return {}


def create_chat(
    title: str | None = None,
    model: str | None = None,
    token: str | None = None,
):
    payload = {}

    if title is not None:
        payload["title"] = title

    if model is not None:
        payload["model"] = model

    headers = _get_headers(token)

    try:
        response = httpx.post(
            f"{config.BASE_URL}/chats",
            json=payload,
            headers=headers,
            timeout=15.0,
        )
        response.raise_for_status()
        return response.json()
    except httpx.HTTPStatusError as e:
        detail = "Upstream chat service error"
        try:
            err_json = e.response.json()
            detail = err_json.get("detail") or err_json.get("message") or e.response.text or detail
        except Exception:
            detail = e.response.text or detail
        raise HTTPException(status_code=e.response.status_code, detail=detail)
    except httpx.RequestError as e:
        raise HTTPException(status_code=503, detail=f"Cannot reach remote chat service: {str(e)}")


def get_chats(token: str | None = None):
    headers = _get_headers(token)

    try:
        response = httpx.get(
            f"{config.BASE_URL}/chats",
            headers=headers,
            timeout=15.0,
        )
        response.raise_for_status()
        return response.json()
    except httpx.HTTPStatusError as e:
        detail = "Upstream chat service error"
        try:
            err_json = e.response.json()
            detail = err_json.get("detail") or err_json.get("message") or e.response.text or detail
        except Exception:
            detail = e.response.text or detail
        raise HTTPException(status_code=e.response.status_code, detail=detail)
    except httpx.RequestError as e:
        raise HTTPException(status_code=503, detail=f"Cannot reach remote chat service: {str(e)}")


def delete_chat(chat_id: int, token: str | None = None):
    headers = _get_headers(token)

    try:
        response = httpx.delete(
            f"{config.BASE_URL}/chats/{chat_id}",
            headers=headers,
            timeout=15.0,
        )
        response.raise_for_status()
        return response.json()
    except httpx.HTTPStatusError as e:
        detail = "Upstream chat service error"
        try:
            err_json = e.response.json()
            detail = err_json.get("detail") or err_json.get("message") or e.response.text or detail
        except Exception:
            detail = e.response.text or detail
        raise HTTPException(status_code=e.response.status_code, detail=detail)
    except httpx.RequestError as e:
        raise HTTPException(status_code=503, detail=f"Cannot reach remote chat service: {str(e)}")
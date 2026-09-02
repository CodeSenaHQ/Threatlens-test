import httpx
from fastapi import HTTPException
from config import config
from db import get_jwt
from schema.llm_chat import ChatMessage


def _get_headers(token: str | None = None) -> dict:
    jwt_val = token or get_jwt()
    if jwt_val:
        return {"Authorization": f"Bearer {jwt_val}"}
    return {}


def get_latest_chat_message(chat_id: int, token: str | None = None) -> ChatMessage | None:
    try:
        response = httpx.get(
            f"{config.BASE_URL}/chats/{chat_id}/history",
            params={
                "page": 1,
                "limit": 1,
            },
            headers=_get_headers(token),
            timeout=15.0,
        )
        response.raise_for_status()
        result = response.json()
        data = result.get("data") if isinstance(result, dict) else None
        if data and isinstance(data, list) and len(data) > 0:
            first = data[0]
            msg_data = first.get("message") if isinstance(first, dict) and "message" in first else first
            if isinstance(msg_data, dict):
                return ChatMessage(**msg_data)
        return None
    except Exception:
        return None


def build_chat_history(
    latest_message: ChatMessage | None,
    messages: list[ChatMessage],
) -> list[ChatMessage]:

    if latest_message is None:
        return messages

    for index, message in enumerate(messages):
        if message == latest_message:
            return messages[index + 1:]

    return messages


def insert_chat_history(
    chat_messages: list[ChatMessage],
    chat_id: int | str,
    token: str | None = None,
):
    payload = {
        "chat_id": int(chat_id),
        "messages": [
            message.model_dump(exclude_none=True)
            for message in chat_messages
        ],
    }

    try:
        response = httpx.post(
            f"{config.BASE_URL}/chats/history",
            json=payload,
            headers=_get_headers(token),
            timeout=15.0,
        )
        response.raise_for_status()
        return response.json()
    except httpx.HTTPStatusError as e:
        detail = "Upstream chat history error"
        try:
            err_json = e.response.json()
            detail = err_json.get("detail") or err_json.get("message") or e.response.text or detail
        except Exception:
            detail = e.response.text or detail
        return {"status": "saved_fallback", "chat_id": int(chat_id), "detail": detail}
    except Exception as e:
        return {"status": "saved_fallback", "chat_id": int(chat_id), "detail": str(e)}


def save_chat_history(
    chat_id: int,
    messages: list[ChatMessage],
    token: str | None = None,
):
    latest_message = get_latest_chat_message(chat_id, token)

    chat_history = build_chat_history(
        latest_message=latest_message,
        messages=messages,
    )

    return insert_chat_history(
        chat_messages=chat_history,
        chat_id=chat_id,
        token=token,
    )


def get_history(
    chat_id: int,
    page: int,
    limit: int,
    token: str | None = None,
):
    try:
        response = httpx.get(
            f"{config.BASE_URL}/chats/{chat_id}/history",
            params={
                "page": page,
                "limit": limit,
            },
            headers=_get_headers(token),
            timeout=15.0,
        )
        response.raise_for_status()
        return response.json()
    except httpx.HTTPStatusError as e:
        detail = "Upstream chat history error"
        try:
            err_json = e.response.json()
            detail = err_json.get("detail") or err_json.get("message") or e.response.text or detail
        except Exception:
            detail = e.response.text or detail
        raise HTTPException(status_code=e.response.status_code, detail=detail)
    except httpx.RequestError as e:
        raise HTTPException(status_code=503, detail=f"Cannot reach remote chat service: {str(e)}")

from fastapi import APIRouter, Query, Header

from schema.llm_chat import (
    CreateChatRequest,
    ChatHistoryRequest,
    ChatMessage,
)

from service.chat_session_service import (
    create_chat,
    get_chats,
    delete_chat,
)

from service.llm_chat_service import (
    save_chat_history,
    get_history,
)


router = APIRouter(
    prefix="/chats",
    tags=["Chats"],
)


def extract_token(authorization: str | None = None) -> str | None:
    if authorization and authorization.startswith("Bearer "):
        token = authorization[7:].strip()
        if token and token != "None" and token != "null":
            return token
    return None


@router.post("")
def create_new_chat(
    data: CreateChatRequest,
    authorization: str | None = Header(None),
):
    token = extract_token(authorization)
    return create_chat(
        title=data.title,
        model=data.model,
        token=token,
    )


@router.get("")
def get_all_chats(
    authorization: str | None = Header(None),
):
    token = extract_token(authorization)
    return get_chats(token=token)


@router.delete("/{chat_id}")
def remove_chat(
    chat_id: int,
    authorization: str | None = Header(None),
):
    token = extract_token(authorization)
    return delete_chat(chat_id, token=token)


@router.post("/history")
def save_history(
    data: ChatHistoryRequest,
    authorization: str | None = Header(None),
):
    token = extract_token(authorization)
    messages = [
        ChatMessage(**m) if isinstance(m, dict) else m
        for m in data.messages
    ]
    return save_chat_history(
        chat_id=data.chat_id,
        messages=messages,
        token=token,
    )


@router.get("/{chat_id}/history")
def get_chat_history(
    chat_id: int,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    authorization: str | None = Header(None),
):
    token = extract_token(authorization)
    return get_history(
        chat_id=chat_id,
        page=page,
        limit=limit,
        token=token,
    )

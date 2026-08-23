import httpx
from config import config
from schema.llm_chat import ChatMessage


def get_latest_chat_message(chat_id: int):
    response = httpx.get(
        f"{config.BASE_URL}/chats/{chat_id}/history",
        params={
            "page": 1,
            "limit": 1,
        },
    )

    response.raise_for_status()
    result = response.json()
    return result["data"][0]


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
    chat_id: str,
):
    payload = {
        "chat_id": chat_id,
        "messages": [
            message.model_dump()
            for message in chat_messages
        ],
    }

    response = httpx.post(
        f"{config.BASE_URL}/chat/history",
        json=payload,
    )

    response.raise_for_status()
    return response.json()


def save_chat_history(
    chat_id: int,
    messages: list[ChatMessage],
):
    latest_message = get_latest_chat_message(chat_id)

    chat_history = build_chat_history(
        latest_message=latest_message,
        messages=messages,
    )

    return insert_chat_history(
        chat_messages=chat_history,
        chat_id=chat_id,
    )


def get_history(
    chat_id: int,
    page: int,
    limit: int,
):
    response = httpx.get(
        f"{config.BASE_URL}/chats/{chat_id}/history",
        params={
            "page": page,
            "limit": limit,
        },
    )

    response.raise_for_status()
    return response.json()



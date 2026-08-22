
from SITE_MODULE.db.models import ChatHistory
from connect import session_factory


def save_chat_history(
    messages: list[dict],
    chat_id: int,
):
    db = session_factory()
    history = [
        ChatHistory(
            message=message,
            chat_id=chat_id,
        )
        for message in messages
    ]

    db.add_all(history)
    db.commit()

    return history


def get_chat_history(
    chat_id: int,
    page: int = 1,
    limit: int = 10,
):
    db = session_factory()

    offset = (page - 1) * limit

    return (
        db.query(ChatHistory)
        .filter(
            ChatHistory.chat_id == chat_id,
        )
        .order_by(ChatHistory.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )
import json 
from schema.llm_chat import ChatMessage

def save_chat_history(
    chat_messages: list[ChatMessage],
    chat_id: str,
):
    messages = json.dumps(
        [message.model_dump() for message in chat_messages]
    )

    # save chat_id + messages to DB
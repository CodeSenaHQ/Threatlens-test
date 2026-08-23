from schema.llm_chat import ChatRequest
from service.llm_gateway_service import chat_completion
from fastapi import APIRouter


router = APIRouter(
    prefix="/llm",
    tags=["LLM Gateway"],
)


@router.post("/chat")
async def chat_completion_gateway(
    body: ChatRequest,
):
    return await chat_completion(body)



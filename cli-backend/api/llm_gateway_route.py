from schema.llm_chat import ChatRequest , PatchUsageRequest
from service.llm_gateway_service import chat_completion 
from db.usage import (
    get_usage,
    patch_usage,
    sync_usage
)

from db.limit import (
    get_limit,
    sync_limit
)
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


@router.get("/usage")
def get_usage_route():
    return get_usage()


@router.patch("/usage")
def patch_usage_route(body:PatchUsageRequest):
    return patch_usage(
        prompt_tokens=body.prompt_tokens,
        completion_tokens=body.completion_tokens
    )


@router.get("/usage/sync")
def sync_global_usage():
    return sync_usage()


@router.get("/limit")
def get_llm_lmits():
    return get_limit()
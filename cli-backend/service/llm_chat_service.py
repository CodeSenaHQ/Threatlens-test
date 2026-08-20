import json
import httpx

from fastapi import HTTPException
from fastapi.responses import StreamingResponse


LLM_PROVIDER_BASE_URL = "https://openrouter.ai/api/v1"
LLM_PROVIDER_API_KEY = "YOUR_OPENROUTER_API_KEY"
DEFAULT_MODEL = "anthropic/claude-3.5-sonnet"


async def chat_completion(
    body,
):
    upstream_payload = {
        "model": body.model or DEFAULT_MODEL,
        "messages": body.messages,
        "temperature": body.temperature,
        "max_tokens": body.max_tokens,
        "stream": body.stream,
    }

    if body.tools:
        upstream_payload["tools"] = body.tools

    headers = {
        "Authorization": f"Bearer {LLM_PROVIDER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://threatlens.io",
        "X-Title": "ThreatLensGo Security Gateway",
    }

    if body.stream:
        return await _stream_completion(
            upstream_payload=upstream_payload,
            headers=headers,
        )

    return await _normal_completion(
        upstream_payload=upstream_payload,
        headers=headers,
    )


async def _normal_completion(
    upstream_payload: dict,
    headers: dict,
):
    try:
        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.post(
                f"{LLM_PROVIDER_BASE_URL}/chat/completions",
                headers=headers,
                json=upstream_payload,
            )

        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=response.text,
            )

        return response.json()

    except HTTPException:
        raise

    except httpx.RequestError as exc:
        raise HTTPException(
            status_code=502,
            detail=f"LLM provider request failed: {str(exc)}",
        )


async def _stream_completion(
    upstream_payload: dict,
    headers: dict,
):
    async def stream_generator():
        try:
            async with httpx.AsyncClient(timeout=120.0) as client:
                async with client.stream(
                    "POST",
                    f"{LLM_PROVIDER_API_KEY}/chat/completions",
                    headers=headers,
                    json=upstream_payload,
                ) as response:

                    if response.status_code != 200:
                        error_body = await response.aread()

                        error = {
                            "error": (
                                f"Upstream Error ({response.status_code}): "
                                f"{error_body.decode()}"
                            )
                        }

                        yield f"data: {json.dumps(error)}\n\n"
                        yield "data: [DONE]\n\n"
                        return

                    async for chunk in response.aiter_raw():
                        yield chunk

        except httpx.RequestError as exc:
            error = {
                "error": f"LLM provider request failed: {str(exc)}"
            }

            yield f"data: {json.dumps(error)}\n\n"
            yield "data: [DONE]\n\n"

    return StreamingResponse(
        stream_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
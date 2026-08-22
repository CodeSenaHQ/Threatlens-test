import json
import httpx
from config import config 

from fastapi import HTTPException
from fastapi.responses import StreamingResponse

def update_usage(prompt_tokens, completion_tokens, total_tokens):
    pass


async def chat_completion(
    body,
):
    upstream_payload = {
        "model": body.model or config.DEFAULT_MODEL,
        "messages": body.messages,
        "temperature": body.temperature,
        "max_tokens": body.max_tokens,
        "stream": body.stream,
    }

    if body.tools:
        upstream_payload["tools"] = body.tools

    headers = {
        "Authorization": f"Bearer {config.LLM_PROVIDER_API_KEY}",
        "Content-Type": "application/json",
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
                f"{config.LLM_PROVIDER_BASE_URL}/chat/completions",
                headers=headers,
                json=upstream_payload,
            )

        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=response.text,
            )

        data = response.json()

        usage = data.get("usage")

        if usage:
            update_usage(
                prompt_tokens=usage.get("prompt_tokens", 0),
                completion_tokens=usage.get("completion_tokens", 0),
                total_tokens=usage.get("total_tokens", 0),
            )

        return data

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
                    f"{config.LLM_PROVIDER_BASE_URL}/chat/completions",
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

                    async for line in response.aiter_lines():

                        if not line:
                            yield "\n"
                            continue

                        # Forward SSE exactly as received
                        yield f"{line}\n"

                        # Check usage without interfering with the stream
                        if line.startswith("data: "):
                            data = line[6:]

                            if data == "[DONE]":
                                continue

                            try:
                                chunk = json.loads(data)
                            except json.JSONDecodeError:
                                continue

                            usage = chunk.get("usage")

                            if usage:
                                update_usage(
                                    prompt_tokens=usage.get(
                                        "prompt_tokens", 0
                                    ),
                                    completion_tokens=usage.get(
                                        "completion_tokens", 0
                                    ),
                                    total_tokens=usage.get(
                                        "total_tokens", 0
                                    ),
                                )

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
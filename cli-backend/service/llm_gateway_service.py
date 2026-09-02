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
    if not config.LLM_PROVIDER_API_KEY:
        raise HTTPException(
            status_code=401,
            detail="OpenRouter API key is not configured. Please set OPENROUTER_API_KEY in .env.",
        )

    upstream_payload = {
        "model": body.model or config.DEFAULT_MODEL,
        "messages": [
            m.model_dump(exclude_none=True) if hasattr(m, "model_dump") else m
            for m in body.messages
        ],
        "temperature": body.temperature,
        "max_tokens": body.max_tokens or 4096,
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
            detail = response.text
            try:
                err_json = response.json()
                detail = err_json.get("error", {}).get("message") or err_json.get("error") or detail
            except Exception:
                pass
            raise HTTPException(
                status_code=response.status_code,
                detail=f"LLM Provider Error ({response.status_code}): {detail}",
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
    client = httpx.AsyncClient(timeout=120.0)
    try:
        req = client.build_request(
            "POST",
            f"{config.LLM_PROVIDER_BASE_URL}/chat/completions",
            headers=headers,
            json=upstream_payload,
        )
        response = await client.send(req, stream=True)

        if response.status_code != 200:
            error_body = await response.aread()
            await response.aclose()
            await client.aclose()
            detail = error_body.decode()
            try:
                err_json = json.loads(detail)
                detail = err_json.get("error", {}).get("message") or err_json.get("error") or detail
            except Exception:
                pass
            raise HTTPException(
                status_code=response.status_code,
                detail=f"LLM Provider Error ({response.status_code}): {detail}",
            )

    except HTTPException:
        raise
    except httpx.RequestError as exc:
        await client.aclose()
        raise HTTPException(
            status_code=502,
            detail=f"LLM provider request failed: {str(exc)}",
        )

    async def stream_generator():
        try:
            async for line in response.aiter_lines():
                if not line:
                    yield "\n"
                    continue

                yield f"{line}\n"

                if line.startswith("data: "):
                    data = line[6:].strip()
                    if data == "[DONE]":
                        continue

                    try:
                        chunk = json.loads(data)
                    except json.JSONDecodeError:
                        continue

                    usage = chunk.get("usage")
                    if usage:
                        update_usage(
                            prompt_tokens=usage.get("prompt_tokens", 0),
                            completion_tokens=usage.get("completion_tokens", 0),
                            total_tokens=usage.get("total_tokens", 0),
                        )
        finally:
            await response.aclose()
            await client.aclose()

    return StreamingResponse(
        stream_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )

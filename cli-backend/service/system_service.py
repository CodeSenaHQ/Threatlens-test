from config import config
import httpx
from db import get_jwt


def _get_header():
    jwt = get_jwt()
    if jwt:
        return {"Authorization": f"Bearer {jwt}"}
    return {}


def chk_state():
    response = httpx.get(
        f"{config.AUTH_BASE_URL}/me",
        headers=_get_header(),
        timeout=15.0,
    )
    return response.json()


def global_sync_usage(body):
    response = httpx.put(
        f"{config.BASE_URL}/usage",
        json=body,
        headers=_get_header(),
        timeout=15.0,
    )
    response.raise_for_status()
    return response.json()


def get_global_limit():
    response = httpx.put(
        f"{config.BASE_URL}/usage",
        headers=_get_header(),
        timeout=15.0,
    )
    response.raise_for_status()

    data = response.json()

    tier = config.PLAN.get(data.get("plan", "free"), 1)
    prompt_tokens = tier * 1_000_000

    return {
        "prompt_tokens": prompt_tokens,
        "completion_tokens": prompt_tokens * 4,
        "total_tokens": prompt_tokens * 4,
    }
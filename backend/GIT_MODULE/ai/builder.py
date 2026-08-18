import json
from google import genai

from GIT_MODULE.ai.context import build_commit_ai_prompt
from GIT_MODULE.ai.prompt import SYSTEM_PROMPT


async def gemini_call(
    message: str,
) -> dict:
    client = genai.Client(
        api_key="AQ.Ab8RN6IQAbY-2ZWt5HD4cKoFVwaa-frs5K4ONUy6z84pBCTy3w"
    )

    response = client.models.generate_content(
        model="gemini-3.5-flash-lite",
        contents=message,
        config={
            "system_instruction": SYSTEM_PROMPT,
            "response_mime_type": "application/json",
        },
    )

    return json.loads(response.text)


async def ai_call(
    diffs: list[dict],
    raw_analysis: dict,
) -> dict:
    message = build_commit_ai_prompt(
        diffs=diffs,
        data=raw_analysis,
        max_diff_chars=10_000,
    )

    return await gemini_call(message)
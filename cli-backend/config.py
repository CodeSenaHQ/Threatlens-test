
import os
from pathlib import Path

class Config :
    BASE_URL = os.getenv("THREATLENS_REMOTE_URL", "https://api.codesena.me")
    AUTH_BASE_URL = f"{BASE_URL}/tc-auth"

    DB_PATH = os.getenv("THREATLENS_DB_PATH", str(Path(__file__).resolve().parent / "local.db"))
    SQLITE_TIMEOUT = 30.0

    LLM_PROVIDER_BASE_URL = "https://openrouter.ai/api/v1"
    LLM_PROVIDER_API_KEY = "YOUR_OPENROUTER_API_KEY"
    DEFAULT_MODEL = "anthropic/claude-3.5-sonnet"

    PLAN = {
        "free": 1,
        "pro": 2, 
        "proplus": 3, 
        "proplus1": 4,
        "proplus2": 5
    }
    


config = Config()

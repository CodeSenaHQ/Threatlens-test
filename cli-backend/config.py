import os
from pathlib import Path
from dotenv import load_dotenv

# Search and load .env from cli-backend or workspace root
base_dir = Path(__file__).resolve().parent
candidates = [
    base_dir / ".env",
    base_dir.parent / ".env",
    base_dir.parent / "ThreatLensGo" / "tui" / ".env",
]
for p in candidates:
    if p.exists():
        load_dotenv(p, override=True)

class Config :
    BASE_URL = os.getenv("THREATLENS_REMOTE_URL", "https://api.codesena.me")
    AUTH_BASE_URL = f"{BASE_URL}/tc-auth"

    DB_PATH = os.getenv("THREATLENS_DB_PATH", str(Path(__file__).resolve().parent / "local.db"))
    SQLITE_TIMEOUT = 30.0

    @property
    def LLM_PROVIDER_BASE_URL(self):
        return os.getenv("LLM_BASE_URL") or os.getenv("LLM_PROVIDER_BASE_URL") or "https://openrouter.ai/api/v1"

    @property
    def LLM_PROVIDER_API_KEY(self):
        return os.getenv("OPENROUTER_API_KEY") or os.getenv("LLM_PROVIDER_API_KEY") or ""

    @property
    def DEFAULT_MODEL(self):
        return os.getenv("LLM_MODEL") or os.getenv("DEFAULT_MODEL") or "anthropic/claude-3.5-sonnet"

    PLAN = {
        "free": 1,
        "pro": 2, 
        "proplus": 3, 
        "proplus1": 4,
        "proplus2": 5
    }

config = Config()

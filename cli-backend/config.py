
class Config :
    BASE_URL = "https://api.codesena.me"
    AUTH_BASE_URL = f"{BASE_URL}/tc-auth"

    DB_PATH = "local.db"
    SQLITE_TIMEOUT = 30.0

    LLM_PROVIDER_BASE_URL = "https://openrouter.ai/api/v1"
    LLM_PROVIDER_API_KEY = "YOUR_OPENROUTER_API_KEY"
    DEFAULT_MODEL = "anthropic/claude-3.5-sonnet"

    TOTAL_CREDITS = 20
    


config = Config()

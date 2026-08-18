
class Config :
    BASE_URL = "https://api.codesena.me"
    AUTH_BASE_URL = f"{BASE_URL}/tc-auth"

    DB_PATH = "local.db"
    SQLITE_TIMEOUT = 30.0


config = Config()

from fastapi import FastAPI
import requests , httpx

app = FastAPI()

BASE_URL = "https://app.totalchaos.online/tc-auth"


# response = httpx.get(
#     "https://api.threadlens.dev/auth/status",
#     headers={
#         "Authorization": f"Bearer {token}"
#     }
# )

# data = response.json()

# print(data)

from fastapi.responses import RedirectResponse


@app.get("/{provider}/login")
def oauth_login(provider):
    return RedirectResponse(
        f"{BASE_URL}/{provider}/login"
        "?frontend_url=http://localhost:1234"
    )


@app.get("/oauth/callback")
def oauth_callback(access_token: str):
    print(access_token)
    return {"status": "logged in"}


def run():
    import uvicorn

    uvicorn.run(
        "connect:app",
        host="0.0.0.0",
        port=1234,
        reload=True,
    )



if __name__ == "__main__":
    run()
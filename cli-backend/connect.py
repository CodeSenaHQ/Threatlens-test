from fastapi import FastAPI
import requests , httpx
from fastapi.responses import RedirectResponse


app = FastAPI()

BASE_URL = "https://api.codesena.me/tc-auth"


# response = httpx.get(
#     "https://api.threadlens.dev/auth/status",
#     headers={
#         "Authorization": f"Bearer {token}"
#     }
# )

# data = response.json()

# print(data)





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
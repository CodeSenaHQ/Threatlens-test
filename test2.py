from sqlalchemy import create_engine
from tc_auth.auth import Auth
from fastapi import FastAPI

engine = create_engine("postgresql://workspace:admin@localhost:5432/tc_auth", echo=False)
app = FastAPI()
auth = Auth(engine, app)

auth.email.register(host="smtp.gmail.com", port=587, username="opencode.engine@gmail.com", password="weyi ogpy niel cvut",sender="opencode.engine@gmail.com", use_tls=True)



def run():
    import uvicorn
    uvicorn.run(
        "test2:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )


if __name__ == "__main__":
    run()

# from tc_auth.auth import Auth
from sqlalchemy import create_engine
from fastapi.middleware.cors import CORSMiddleware
from tc_auth import Auth
from fastapi import FastAPI

engine = create_engine("postgresql://workspace:admin@localhost:5432/tc_auth", echo=False)

app = FastAPI()
auth = Auth(engine, app)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



auth.jwt.config(
    secret_key="12345678901234567890123456789012", 
    algorithm="HS256", 
    session_duration_days=7
)




def run():
    import uvicorn
    uvicorn.run(
        "test:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )


if __name__ == "__main__":
    run()
    
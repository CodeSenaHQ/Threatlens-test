from tc_auth import Auth
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine
from fastapi import FastAPI

# you can also do from tc_auth import * , to import all the modules like FastAPI, CORSMiddleware, create_engine, Auth etc 

app = FastAPI()
engine = create_engine("postgresql://workspace:admin@localhost:5432/tc_auth")
auth = ""
auth = Auth(engine=engine, app=app)


# it is recommend to add CORSMiddleware to the app
# without it you wont be able to connect to tc_auth dashboard
# must allow origin https://app.totalchaos.online to access the ui dashboard

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# configure email service
# guide link 
auth.email.config(
    host="smtp.gmail.com", 
    port=587, 
    username="opencode.engine@gmail.com", 
    password="test", 
    sender="opencode.engine@gmail.com", 
    sender_name="Total Chaos", # Default is Sender 
    use_tls=True               # Default is True
)

# configure google service
# guide link 
# https://console.cloud.google.com/apis/credentials
auth.google.config(
    client_id="your-google-client-id",
    client_secret="your-google-client-secret",
    redirect_uri="https://app.totalchaos.online/tc-auth/google/callback",
)

# configure github service
# guide link 
# https://github.com/settings/developers
# then create a new OAuth App ID and Secret
auth.github.config(
    client_id="your-github-client-id",
    client_secret="your-github-client-secret",
    redirect_uri="https://app.totalchaos.online/tc-auth/github/callback",
)

# configure jwt service
# initially there is no need to setup jwt config the library will use default default values
auth.jwt.config(
    secret_key="12345678901234567890123456789012", 
    algorithm="HS256", 
    session_duration_days=7
)


def run():
    import uvicorn
    uvicorn.run(
        "connect:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )


if __name__ == "__main__":
    run()
    
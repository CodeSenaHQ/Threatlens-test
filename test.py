# from tc_auth.auth import Auth
from sqlalchemy import create_engine
import secrets
from tc_auth.auth import Auth



engine1 = create_engine("postgresql://workspace:admin@localhost:5432/tc_auth", echo=True)
app = "test"



from fastapi import FastAPI

app = FastAPI()
auth = Auth(engine1, app)

@app.post("/login")
def login(identifier: str, password: str):
    return auth.service.login(identifier=identifier, password=password)

@app.post("/signup")
def signup(name: str, email: str, password: str):
    return auth.service.signup(
        name=name,
        email=email,
        password=password,
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
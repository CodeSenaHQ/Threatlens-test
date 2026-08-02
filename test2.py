from sqlalchemy import create_engine
from tc_auth.auth import Auth
from fastapi import FastAPI

engine = create_engine("postgresql://workspace:admin@localhost:5432/tc_auth", echo=False)
app = FastAPI()
auth = Auth(engine, app)

avatar_url="https://m.gettywallpapers.com/wp-content/uploads/2023/06/Pfp-Cool.jpg",



y = auth.oauth.login()
print(y)

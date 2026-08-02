from sqlalchemy import create_engine
from tc_auth.auth import Auth
from fastapi import FastAPI

engine = create_engine("postgresql://workspace:admin@localhost:5432/tc_auth", echo=True)
app = FastAPI()
auth = Auth(engine, app)

auth.init()
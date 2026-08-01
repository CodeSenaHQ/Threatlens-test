# from tc_auth.auth import Auth
from sqlalchemy import create_engine
import secrets

# engine1 = create_engine("postgresql://workspace:admin@localhost:5432/tc_auth", echo=True)
# app = "test"
# auth = Auth(engine1, app)

token = secrets.token_urlsafe(48)
print(token)

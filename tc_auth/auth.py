from sqlalchemy import Engine 
from fastapi import FastAPI
from tc_auth.exceptions.handler import auth_exception_handler

from tc_auth.db.base import Base
from tc_auth.db.session import create_session_factory
import tc_auth.db.models
from tc_auth.service.get_user import GetUserService
from tc_auth.service.account import AccountService
from tc_auth.exceptions.error import AuthError



class Auth:
    def __init__(self, engine: Engine , app: FastAPI):
        self.engine = engine
        self.app = app
        self.session_factory = create_session_factory(engine)
        self.get_user = GetUserService(self.session_factory)
        self.account = AccountService(self.session_factory, self.get_user)
        _handlers_registered = False



    def _register_handlers(self):
        if Auth._handlers_registered:
            return

        self.app.add_exception_handler(
            AuthError,
            auth_exception_handler,
        )

        Auth._handlers_registered = True
    

    def init(self):
        Base.metadata.create_all(bind=self.engine)

    def destroy(self):
        Base.metadata.drop_all(bind=self.engine)




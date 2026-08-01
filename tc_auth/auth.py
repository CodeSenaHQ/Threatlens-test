from sqlalchemy import Engine 
from fastapi import FastAPI
from tc_auth.exceptions.handler import auth_exception_handler

import tc_auth.db.models
from tc_auth.db.base import Base
from tc_auth.db.session import create_session_factory
from tc_auth.service.get_user import GetUserService
from tc_auth.service.session import SessionService
from tc_auth.service.auth_service import AuthService
from tc_auth.dependencies.auth_deps import AuthDeps
from tc_auth.service.account import AccountService
from tc_auth.exceptions.error import AuthError



class Auth:
    def __init__(self, engine: Engine , app: FastAPI):
        self.engine = engine
        self.app = app
        self.session_factory = create_session_factory(engine)
        self.get_user = GetUserService(session_factory=self.session_factory)
        self.account = AccountService(session_factory=self.session_factory, get_user=self.get_user)
        self.session = SessionService(session_factory=self.session_factory)
        self.auth_service = AuthService(get_user=self.get_user, account=self.account, session=self.session)
        self.deps = AuthDeps(get_user=self.get_user, session=self.session)

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




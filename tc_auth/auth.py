from fastapi import FastAPI
from sqlalchemy import Engine 

from tc_auth.exceptions.error import AuthError
from tc_auth.exceptions.handler import auth_exception_handler

import tc_auth.db.models
from tc_auth.db.base import Base
from tc_auth.db.session import create_session_factory

from tc_auth.service.auth_service import AuthService
from tc_auth.service.oauth_service import OAuthService
from tc_auth.service.session_service import SessionService
from tc_auth.service.account_service import AccountService
from tc_auth.service.get_user_service import GetUserService

from tc_auth.oauth.google import GoogleOAuth
from tc_auth.oauth.github import GitHubOAuth

from tc_auth.dependencies.auth_deps import AuthDeps
from tc_auth.dependencies.role_deps import RoleDeps
from tc_auth.dependencies.status_deps import StatusDeps



class Auth:
    def __init__(self, engine: Engine , app: FastAPI):
        self.engine = engine
        self.app = app
        self.session_factory = create_session_factory(engine)
        
        self.get_user = GetUserService(session_factory=self.session_factory)
        self.account = AccountService(session_factory=self.session_factory, get_user=self.get_user)
        self.session = SessionService(session_factory=self.session_factory)
        self.service = AuthService(get_user=self.get_user, account=self.account, session=self.session)

        self.oauth = OAuthService(get_user=self.get_user, session_factory=self.session_factory, account=self.account, auth_service=self.service)
        self.google = GoogleOAuth(oauth=self.oauth)
        self.github = GitHubOAuth(oauth=self.oauth)

        
        self.deps = AuthDeps(get_user=self.get_user, session=self.session)
        self.role = RoleDeps(auth_deps=self.deps)
        self.status = StatusDeps(auth_deps=self.deps)
        
        self.app.add_exception_handler(AuthError,auth_exception_handler,)

    

    def init(self):
        Base.metadata.create_all(bind=self.engine)

    def destroy(self):
        Base.metadata.drop_all(bind=self.engine)




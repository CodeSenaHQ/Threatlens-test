from sqlalchemy import Engine

from tc_auth.db.base import Base
from tc_auth.db.session import create_session_factory
import tc_auth.db.models
from tc_auth.service.get_user import GetUserService



class Auth:
    def __init__(self, engine: Engine):
        self.engine = engine
        self.session_factory = create_session_factory(engine)
        self.get_user_service = GetUserService(self.session_factory)

    def init(self):
        Base.metadata.create_all(bind=self.engine)
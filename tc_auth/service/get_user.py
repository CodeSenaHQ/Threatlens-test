class GetUserService:
    def __init__(self, session_factory):
        self.session_factory = session_factory

    def get_by_email(self, email):
        with self.session_factory() as db:
            pass

    def get_by_uid(self, uid):
        with self.session_factory() as db:
            pass

        
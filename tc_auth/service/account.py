class AccountService:
    def __init__(self, engine):
        self.engine = engine

    def get_user(self, email):
        print(f"Searching '{email}' using DB: {self.engine}")
        return {
            "id": 1,
            "email": email
        }

    def create_user(self, email):
        print(f"Creating '{email}' using DB: {self.engine}")
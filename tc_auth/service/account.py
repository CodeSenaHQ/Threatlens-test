class AccountService:
    def __init__(self, engine):
        self.engine = engine


    def create_user(self, email):
        print(f"Creating '{email}' using DB: {self.engine}")
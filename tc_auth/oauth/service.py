class OAuthService:
    def __init__(
        self,
        session_factory,
        get_user,
        account,
        auth,
    ):
        self.session_factory = session_factory
        self.get_user = get_user
        self.account = account
        self.auth = auth

# ---------- PUBLIC ----------

    def login(
        self,
        *,
        provider: str,
        provider_user_id: str,
        email: str | None = None,
        email_verified: bool = False,
        name: str | None = None,
        avatar_url: str | None = None,
        ip_address: str | None = None,
        user_agent: str | None = None,
    ):
        ...

    def link(
        self,
        *,
        account_id: int,
        provider: str,
        provider_user_id: str,
    ):
        ...

    def unlink(
        self,
        *,
        account_id: int,
        provider: str,
    ):
        ...

    def get_linked_accounts(
        self,
        *,
        account_id: int,
    ):
        ...

# ---------- PRIVATE ----------

    def _get_oauth(
        self,
        db,
        *,
        provider: str,
        provider_user_id: str,
    ):
        ...

    def _create_oauth(
        self,
        db,
        *,
        account_id: int,
        provider: str,
        provider_user_id: str,
    ):
        ...

    def _delete_oauth(
        self,
        db,
        *,
        account_id: int,
        provider: str,
    ):
        ...

    def _find_or_create_account(
        self,
        *,
        email: str | None,
        email_verified: bool,
        name: str | None,
        avatar_url: str | None,
    ):
        ...
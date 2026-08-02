from authlib.integrations.starlette_client import OAuth
from fastapi import Request


class GoogleOAuth:
    def __init__(self, oauth_service):
        self.oauth_service = oauth_service
        self.client = None
        self.redirect_uri = None

    def register(
        self,
        *,
        client_id: str,
        client_secret: str,
        redirect_uri: str,
    ):
        self.redirect_uri = redirect_uri

        oauth = OAuth()

        self.client = oauth.register(
            name="google",
            client_id=client_id,
            client_secret=client_secret,
            server_metadata_url=(
                "https://accounts.google.com/.well-known/openid-configuration"
            ),
            client_kwargs={
                "scope": "openid email profile",
            },
        )

    async def login(
        self,
        request: Request,
    ):
        return await self.client.authorize_redirect(
            request,
            self.redirect_uri,
        )

    async def callback(
        self,
        request: Request,
        *,
        ip_address: str | None = None,
        user_agent: str | None = None,
    ):
        token = await self.client.authorize_access_token(
            request,
        )

        user = token["userinfo"]

        return self.oauth_service.login(
            provider="google",
            provider_user_id=user["sub"],
            name=user.get("name"),
            email=user.get("email"),
            avatar_url=user.get("picture"),
            ip_address=ip_address,
            user_agent=user_agent,
        )
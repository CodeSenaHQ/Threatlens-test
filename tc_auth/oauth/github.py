from authlib.integrations.starlette_client import OAuth
from fastapi import Request


class GitHubOAuth:
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
            name="github",
            client_id=client_id,
            client_secret=client_secret,
            access_token_url="https://github.com/login/oauth/access_token",
            authorize_url="https://github.com/login/oauth/authorize",
            api_base_url="https://api.github.com/",
            client_kwargs={
                "scope": "read:user user:email",
            },
        )

    async def authorize(
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

        user = await self.client.get(
            "user",
            token=token,
        )

        user = user.json()

        email = user.get("email")

        if email is None:
            emails = await self.client.get(
                "user/emails",
                token=token,
            )

            for item in emails.json():
                if (
                    item["primary"]
                    and item["verified"]
                ):
                    email = item["email"]
                    break

        return self.oauth_service.login(
            provider="github",
            provider_user_id=str(user["id"]),
            name=user.get("name"),
            email=email,
            avatar_url=user.get("avatar_url"),
            ip_address=ip_address,
            user_agent=user_agent,
        )
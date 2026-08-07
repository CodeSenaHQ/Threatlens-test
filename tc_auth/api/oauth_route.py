from fastapi import APIRouter, Request

class OAuthRoutes:
    def __init__(
        self,
        app,
        google,
        github,

    ):
        self.google = google
        self.github = github

        router = APIRouter()

        router.get("/google/login")(self.google_login)
        router.get("/google/callback")(self.google_callback)
        router.get("/github/login")(self.github_login)
        router.get("/github/callback")(self.github_callback)
 

        app.include_router(router)

    # ==========================================================
    # GOOGLE OAUTH
    # ==========================================================

    def google_login(
        self,
        request : Request,
    ):
        return self.google.login(request)
    
    def google_callback(
        self,
        request : Request,
    ):
        meta = self._request_meta(request)
        return self.google.callback(request, **meta)
    
    # ==========================================================
    # GITHUB OAUTH
    # ==========================================================

    def github_login(
        self,
        request : Request,
    ):
        return self.github.login(request)
    
    
    def github_callback(
        self,
        request : Request,
    ):
        meta = self._request_meta(request)
        return self.github.callback(request, **meta)


    # ==========================================================
    # PRIVATE
    # ==========================================================

    def _request_meta(
        self,
        request: Request,
    ):
        ip = (
            request.headers.get("cf-connecting-ip")
            or request.headers.get("x-forwarded-for")
            or (
                request.client.host
                if request.client
                else None
            )
        )

        return {
            "ip_address": ip,
            "user_agent": request.headers.get(
                "user-agent",
                "",
            ),
        }
import uvicorn

from connect import app
from GIT_MODULE.api.repo_route import router as repo_router
from SITE_MODULE.api.chat_route import router as chat_router



def create_app():
    print("REGISTERING REPO ROUTER", id(app), id(repo_router), id(chat_router))
    app.include_router(repo_router)
    app.include_router(chat_router)
    return app


if __name__ == "__main__":
    create_app()

    uvicorn.run(
        "run:app",
        host="0.0.0.0",
        port=8000,
        reload=False,
    )
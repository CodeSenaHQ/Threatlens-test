import uvicorn

from connect import app
from GIT_MODULE.api.repo_route import router


def create_app():
    print("REGISTERING REPO ROUTER", id(app), id(router))
    app.include_router(router)
    return app


if __name__ == "__main__":
    create_app()

    uvicorn.run(
        "run:app",
        host="0.0.0.0",
        port=8000,
        reload=False,
    )
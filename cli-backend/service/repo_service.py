from urllib import response
import httpx

from analysis import (
    CommitAnalyzer,
    RepositoryAnalyzer,
)

from db import get_jwt
from repo import Repository
from config import config
jwt = get_jwt()


def fetch_repo(repo: Repository, jwt: str):

    if not jwt:
        raise RuntimeError("JWT token not found")

    structure = RepositoryAnalyzer(repo)
    data = structure.analyze().to_dict()

    response = httpx.post(
        f"{config.BASE_URL}/repo",
        json={"data": data},
        headers={
            "Authorization": f"Bearer {jwt}",
        },
        timeout=30.0,
    )

    response.raise_for_status()
    return response.json()


def fetch_latest_commit(repo_id: int, jwt: str):
    if not jwt:
        raise RuntimeError("JWT token not found")
    
    response = httpx.get(
        f"{config.BASE_URL}/repo/{repo_id}/commits?limit=1",
        headers={
            "Authorization": f"Bearer {jwt}",
        },
        timeout=30.0,
    )
    response.raise_for_status()
    return response.json()


from datetime import datetime


def build_commit_insert(sha: str, repo: Repository):
    commits = repo.list_commits()

    for index, commit in enumerate(commits):
        if commit["sha"] == sha:
            commits_after = commits[:index]

            if not commits_after:
                return None

            return [
                {
                    **commit,
                    "authored_at": (
                        commit["authored_at"].isoformat()
                        if isinstance(commit["authored_at"], datetime)
                        else commit["authored_at"]
                    ),
                    "committed_at": (
                        commit["committed_at"].isoformat()
                        if isinstance(commit["committed_at"], datetime)
                        else commit["committed_at"]
                    ),
                }
                for commit in commits_after
            ]

    return None


def upsert_commits(commits: list[dict], jwt: str):

    if not jwt:
        raise RuntimeError("JWT token not found")

    response = httpx.post(
        f"{config.BASE_URL}/commit",
        json={
            "data": commits,
        },
        headers={
            "Authorization": f"Bearer {jwt}",
        },
        timeout=30.0,
    )

    response.raise_for_status()

    return response.json()
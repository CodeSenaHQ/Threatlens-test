from __future__ import annotations

import shutil
import tempfile
from dataclasses import asdict, dataclass
from datetime import datetime
from pathlib import Path

from git import Repo
from git.exc import GitCommandError


@dataclass
class CommitInfo:
    sha: str
    short_sha: str

    author_name: str
    author_email: str

    committer_name: str
    committer_email: str

    authored_at: datetime
    committed_at: datetime

    message: str
    parents: list[str]


class Repository:
    """
    Remote public Git repository interface.

    The repository is cloned into a temporary directory only when
    required and is deleted after the operation completes.

    Example:
        repo = Repository(
            "https://github.com/fastapi/fastapi.git"
        )

        print(repo.info_repo())

        commits = repo.list_commits(
            branch="main",
            limit=10,
        )

        commit = repo.info_commit(
            commits[0]["sha"]
        )

        changes = repo.diff(
            commits[0]["sha"]
        )
    """

    def __init__(self, url: str):
        self.url = self._normalize_url(url)

    # ==========================================================
    # INTERNAL
    # ==========================================================

    @staticmethod
    def _normalize_url(url: str) -> str:
        url = url.strip()

        if not url:
            raise ValueError(
                "Repository URL cannot be empty."
            )

        if not url.startswith("https://"):
            raise ValueError(
                "Only HTTPS repositories are supported."
            )

        return url.rstrip("/")

    def _create_temp_repo(self) -> tuple[Repo, Path]:
        """
        Clone the remote repository into a temporary directory.

        Returns:
            (Repo, temporary_directory)
        """

        temp_dir = Path(
            tempfile.mkdtemp(
                prefix="trustgit-"
            )
        )

        repo_path = temp_dir / "repo"

        try:
            repo = Repo.clone_from(
                self.url,
                repo_path,
            )

            return repo, temp_dir

        except Exception:
            shutil.rmtree(
                temp_dir,
                ignore_errors=True,
            )
            raise

    @staticmethod
    def _cleanup(temp_dir: Path):
        shutil.rmtree(
            temp_dir,
            ignore_errors=True,
        )

    @staticmethod
    def _get_default_branch(repo: Repo) -> str:
        """
        Determine the remote's default branch.
        """

        try:
            remote = repo.remote("origin")

            # origin/HEAD -> origin/main
            symbolic = remote.refs.HEAD

            return symbolic.reference.name.split("/")[-1]

        except Exception:
            pass

        try:
            return repo.active_branch.name

        except Exception:
            raise RuntimeError(
                "Could not determine repository default branch."
            )

    @staticmethod
    def _resolve_commit(repo: Repo, sha: str):
        if not sha or not sha.strip():
            raise ValueError(
                "Commit SHA cannot be empty."
            )

        try:
            return repo.commit(sha)

        except Exception as exc:
            raise ValueError(
                f"Commit not found: {sha}"
            ) from exc

    @staticmethod
    def _commit_to_info(commit) -> CommitInfo:
        return CommitInfo(
            sha=commit.hexsha,
            short_sha=commit.hexsha[:7],

            author_name=commit.author.name,
            author_email=commit.author.email,

            committer_name=commit.committer.name,
            committer_email=commit.committer.email,

            authored_at=commit.authored_datetime,
            committed_at=commit.committed_datetime,

            message=commit.message.strip(),

            parents=[
                parent.hexsha
                for parent in commit.parents
            ],
        )

    # ==========================================================
    # REPOSITORY INFO
    # ==========================================================

    def info_repo(self) -> dict:
        """
        Return metadata about the remote repository.
        """

        repo, temp_dir = self._create_temp_repo()

        try:
            default_branch = self._get_default_branch(repo)

            branches = [
                branch.name
                for branch in repo.branches
            ]

            remote_branches = []

            for ref in repo.remotes.origin.refs:
                if ref.name == "origin/HEAD":
                    continue

                remote_branches.append(
                    ref.name.removeprefix("origin/")
                )

            commit_count = sum(
                1
                for _ in repo.iter_commits("--all")
            )

            return {
                "url": self.url,
                "name": Path(
                    self.url.rstrip("/")
                ).name.removesuffix(".git"),

                "default_branch": default_branch,

                "branches": branches,
                "remote_branches": remote_branches,

                "commit_count": commit_count,
            }

        finally:
            self._cleanup(temp_dir)

    # ==========================================================
    # LIST COMMITS
    # ==========================================================

    def list_commits(
        self,
        branch: str | None = None,
        limit: int | None = None,
    ) -> list[dict]:
        """
        List commits from a branch.

        Args:
            branch:
                Branch to inspect.
                If None, the repository default branch is used.

            limit:
                Maximum number of commits.
                If None, all commits are returned.
        """

        if limit is not None and limit <= 0:
            raise ValueError(
                "limit must be greater than 0."
            )

        repo, temp_dir = self._create_temp_repo()

        try:
            if branch is None:
                branch = self._get_default_branch(repo)

            try:
                commits = repo.iter_commits(
                    branch,
                    max_count=limit,
                )

            except GitCommandError as exc:
                raise ValueError(
                    f"Branch not found: {branch}"
                ) from exc

            return [
                asdict(
                    self._commit_to_info(commit)
                )
                for commit in commits
            ]

        finally:
            self._cleanup(temp_dir)

    # ==========================================================
    # COMMIT INFO
    # ==========================================================

    def info_commit(
        self,
        sha: str,
    ) -> dict:
        """
        Return detailed metadata for a commit.
        """

        repo, temp_dir = self._create_temp_repo()

        try:
            commit = self._resolve_commit(
                repo,
                sha,
            )

            return asdict(
                self._commit_to_info(commit)
            )

        finally:
            self._cleanup(temp_dir)

    # ==========================================================
    # DIFF
    # ==========================================================

    def diff(
        self,
        sha: str,
    ) -> list[dict]:
        """
        Return file-level changes introduced by a commit.

        For a normal commit:
            parent -> commit

        For a merge commit:
            first parent -> commit

        For the root commit:
            empty tree -> commit
        """

        repo, temp_dir = self._create_temp_repo()

        try:
            commit = self._resolve_commit(
                repo,
                sha,
            )

            # --------------------------------------------------
            # Normal / merge commit
            # --------------------------------------------------

            if commit.parents:

                parent = commit.parents[0]

                diffs = parent.diff(
                    commit,
                    create_patch=True,
                )

            # --------------------------------------------------
            # Root commit
            # --------------------------------------------------

            else:
                empty_tree = repo.tree(
                    repo.git.mktree(
                        stdin=""
                    )
                )

                diffs = empty_tree.diff(
                    commit,
                    create_patch=True,
                )

            result = []

            for item in diffs:

                patch = item.diff

                if isinstance(patch, bytes):
                    patch = patch.decode(
                        "utf-8",
                        errors="replace",
                    )

                result.append(
                    {
                        "change_type": item.change_type,

                        "old_path": item.a_path,
                        "new_path": item.b_path,

                        "old_mode": (
                            str(item.a_mode)
                            if item.a_mode
                            else None
                        ),

                        "new_mode": (
                            str(item.b_mode)
                            if item.b_mode
                            else None
                        ),

                        "diff": patch,
                    }
                )

            return result

        finally:
            self._cleanup(temp_dir)
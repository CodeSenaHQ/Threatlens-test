from datetime import UTC, datetime, timedelta
import secrets

from tc_auth.config import SESSION_DURATION_DAYS
from tc_auth.db.models import Session
from tc_auth.utils.get_helper import to_dict
from tc_auth.utils.hasher import simple_hash
from tc_auth.exceptions.error import SessionNotFoundError


class SessionService:
    def __init__(self, session_factory):
        self.session_factory = session_factory

    def _get_session(
        self,
        db,
        session_id: int,
    ):
        session = (
            db.query(Session)
            .filter(Session.id == session_id)
            .first()
        )

        if session is None:
            raise SessionNotFoundError("id", session_id)

        return session

    def create_session(
        self,
        account_id: int,
        ip_address: str | None = None,
        user_agent: str | None = None,
    ):

        token = secrets.token_urlsafe(48)

        with self.session_factory() as db:

            session = Session(
                account_id=account_id,
                token_hash=simple_hash(token),
                ip_address=ip_address,
                user_agent=user_agent,
                expires_at=datetime.now(UTC)
                + timedelta(days=SESSION_DURATION_DAYS),
            )

            db.add(session)
            db.commit()
            db.refresh(session)

            return {
                "session_id": session.id,
                "token": token,
            }

    def by_id(
        self,
        session_id: int,
    ):
        with self.session_factory() as db:

            session = self._get_session(db, session_id)

            return to_dict(session)

    def all_by_account(
        self,
        account_id: int,
    ):
        with self.session_factory() as db:

            sessions = (
                db.query(Session)
                .filter(Session.account_id == account_id)
                .order_by(Session.created_at.desc())
                .all()
            )

            return [
                to_dict(session)
                for session in sessions
            ]

    def destroy_session(
        self,
        session_id: int,
    ):
        with self.session_factory() as db:

            session = self._get_session(db, session_id)

            db.delete(session)
            db.commit()

    def destroy_all_by_account(
        self,
        account_id: int,
    ):
        with self.session_factory() as db:

            (
                db.query(Session)
                .filter(Session.account_id == account_id)
                .delete(synchronize_session=False)
            )

            db.commit()

    def cleanup_expired(self):
        with self.session_factory() as db:

            (
                db.query(Session)
                .filter(
                    Session.expires_at < datetime.now(UTC)
                )
                .delete(synchronize_session=False)
            )

            db.commit()
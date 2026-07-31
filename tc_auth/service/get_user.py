from tc_auth.db.models import Account
from tc_auth.utils.get_helper import to_dict


class GetUserService:
    def __init__(self, session_factory):
        self.session_factory = session_factory

    def _get_by(
        self,
        column,
        value,
        include_password: bool = False,
    ):
        with self.session_factory() as db:
            account = (
                db.query(Account)
                .filter(column == value)
                .first()
            )

            if account is None:
                return None

            exclude = [] if include_password else ["password_hash"]
            return to_dict(account, exclude=exclude)

    def by_id(
        self,
        account_id: int,
        include_password: bool = False,
    ):
        return self._get_by(
            Account.id,
            account_id,
            include_password,
        )

    def by_uid(
        self,
        uid: str,
        include_password: bool = False,
    ):
        return self._get_by(
            Account.uid,
            uid,
            include_password,
        )

    def by_email(
        self,
        email: str,
        include_password: bool = False,
    ):
        return self._get_by(
            Account.email,
            email,
            include_password,
        )

    def by_handle(
        self,
        handle: str,
        include_password: bool = False,
    ):
        return self._get_by(
            Account.handle,
            handle,
            include_password,
        )

    def by_phone(
        self,
        phone: str,
        include_password: bool = False,
    ):
        return self._get_by(
            Account.phone,
            phone,
            include_password,
        )

    
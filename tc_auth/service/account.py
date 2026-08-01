from sqlalchemy.exc import IntegrityError

from tc_auth.utils.hasher import hash_password
from tc_auth.db.models import Account
from tc_auth.exceptions.error import (
    EmailAlreadyExistsError,
    HandleAlreadyExistsError,
    PhoneAlreadyExistsError,
    UserNotFoundError,
)


class AccountService:
    def __init__(self, session_factory, get_user):
        self.session_factory = session_factory
        self.get_user = get_user


#===========================Internal Helpers===========================
# GET ACCOUNT BY ID & UserNotFoundError HANDLER

    def _get_account(
        self,
        db,
        account_id: int,
    ):
        account = (
            db.query(Account)
            .filter(Account.id == account_id)
            .first()
        )

        if account is None:
            raise UserNotFoundError("id", account_id)

        return account
    
    
# HANDLE INTEGRITY ERROR & ROLLBACK SESSION

    def _handle_integrity_error(
        self,
        db,
        error: IntegrityError,
    ):
        db.rollback()

        message = str(error.orig)

        if "uq_accounts_email" in message:
            raise EmailAlreadyExistsError()

        if "uq_accounts_handle" in message:
            raise HandleAlreadyExistsError()

        if "uq_accounts_phone" in message:
            raise PhoneAlreadyExistsError()

        raise error
    
#=============================Public Methods===========================
# CREATE USER

    def create_user(
        self,
        name: str,
        email: str,
        password: str,
        handle: str | None = None,
        phone: str | None = None,
        role: str | None = None,
        status: str | None = None,
    ):
        with self.session_factory() as db:

            account = Account(
                name=name,
                email=email,
                password_hash=hash_password(password),
            )

            if handle is not None:
                account.handle = handle

            if phone is not None:
                account.phone = phone

            if role is not None:
                account.role = role

            if status is not None:
                account.status = status

            try:
                db.add(account)
                db.commit()
                db.refresh(account)

            except IntegrityError as e:
                self._handle_integrity_error(db, e)

            return self.get_user.by_id(account.id)
        


# UPDATE ACCOUNT

    def update_account(
        self,
        account_id: int,
        *,
        name: str | None = None,
        handle: str | None = None,
        email: str | None = None,
        phone: str | None = None,
    ):
        with self.session_factory() as db:

            account = self._get_account(db, account_id)

            if name is not None:
                account.name = name

            if handle is not None:
                account.handle = handle

            if email is not None:
                account.email = email

            if phone is not None:
                account.phone = phone

            try:
                db.commit()
                db.refresh(account)

            except IntegrityError as e:
                self._handle_integrity_error(db, e)

            return self.get_user.by_id(account.id)
        


# DELETE ACCOUNT

    def delete_account(
        self,
        account_id: int,
    ):
        with self.session_factory() as db:

            account = self._get_account(db, account_id)
            db.delete(account)
            db.commit()


# CHANGE PASSWORD

    def change_password(
        self,
        account_id: int,
        password: str,
    ):
        with self.session_factory() as db:

            account = self._get_account(db, account_id)
            account.password_hash = hash_password(password)
            db.commit()


# CHANGE ROLE

    def change_role(
        self,
        account_id: int,
        role: str,
    ):
        with self.session_factory() as db:

            account = self._get_account(db, account_id)
            account.role = role
            db.commit()


# CHANGE STATUS

    def change_status(
        self,
        account_id: int,
        status: str | None,
    ):
        with self.session_factory() as db:

            account = self._get_account(db, account_id)
            account.status = status
            db.commit()
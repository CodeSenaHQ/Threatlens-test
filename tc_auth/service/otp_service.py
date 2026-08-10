import random
from datetime import datetime, timedelta
from tc_auth.utils.get_helper import to_list_dict
from tc_auth.db.models import OTP
from tc_auth.utils.hasher import simple_hash, verify_hash 
from tc_auth.exceptions.error import (
    OTPExpiredError,
    OTPInvalidError,
    OTPNotFoundError,
)


import random
from datetime import datetime, timedelta


class OTPService:
    def __init__(self, session_factory):
        self.session_factory = session_factory

    # ==========================================================
    # CREATE
    # ==========================================================

    def create(
        self,
        *,
        identifier: str,
        purpose: str,
        expiry: int = 300,
        length: int = 6,
    ):
        otp = self._generate_otp(length)
        expires_at = datetime.now() + timedelta(seconds=expiry)

        with self.session_factory() as db:

            db.query(OTP).filter_by(
                identifier=identifier,
                purpose=purpose,
            ).delete()

            db.add(
                OTP(
                    identifier=identifier,
                    purpose=purpose,
                    code_hash=simple_hash(otp),
                    expires_at=expires_at,
                )
            )

            db.commit()

        return {
            "otp": otp,
            "expires_at": int(expires_at.timestamp()),
        }

    # ==========================================================
    # VERIFY
    # ==========================================================

    def verify(
        self,
        *,
        identifier: str,
        purpose: str,
        otp: str,
    ):
        with self.session_factory() as db:

            record = self._get(
                db,
                identifier,
                purpose,
            )

            if record is None:
                raise OTPNotFoundError()

            if record.expires_at < datetime.now():
                db.delete(record)
                db.commit()
                raise OTPExpiredError()

            if not verify_hash(
                otp,
                record.code_hash,
            ):
                raise OTPInvalidError()

            db.delete(record)
            db.commit()

    # ==========================================================
    # DELETE
    # ==========================================================

    def revoke(
        self,
        *,
        identifier: str,
        purpose: str,
    ):
        with self.session_factory() as db:

            deleted = (
                db.query(OTP)
                .filter_by(
                    identifier=identifier,
                    purpose=purpose,
                )
                .delete()
            )

            db.commit()

            return bool(deleted)

    # ==========================================================
    # CLEANUP
    # ==========================================================

    def cleanup(
        self,
    ):
        with self.session_factory() as db:

            deleted = (
                db.query(OTP)
                .filter(
                    OTP.expires_at < datetime.now()
                )
                .delete()
            )

            db.commit()

            return deleted
        

    def get_all(self, page: int = 1, limit: int = 10):
        with self.session_factory() as db:
            offset = (page - 1) * limit

            otps = (
                db.query(OTP)
                .order_by(OTP.id.desc())
                .offset(offset)
                .limit(limit)
                .all()
            )

            return to_list_dict(otps)
        
    def query(self, identifier: str):
        with self.session_factory() as db:
            otps = (
                db.query(OTP)
                .filter(OTP.identifier == identifier)
                .order_by(OTP.id.desc())
                .all()
            )

            return to_list_dict(otps)

    # ==========================================================
    # CLEAR ALL
    # ==========================================================


    def clear_all(self):
        with self.session_factory() as db:
            db.query(OTP).delete(synchronize_session=False)
            db.commit()

    # ==========================================================
    # PRIVATE
    # ==========================================================

    def _get(
        self,
        db,
        identifier: str,
        purpose: str,
    ):
        return (
            db.query(OTP)
            .filter_by(
                identifier=identifier,
                purpose=purpose,
            )
            .first()
        )

    def _generate_otp(
        self,
        length: int,
    ):
        minimum = 10 ** (length - 1)
        maximum = (10 ** length) - 1

        return str(
            random.randint(
                minimum,
                maximum,
            )
        )
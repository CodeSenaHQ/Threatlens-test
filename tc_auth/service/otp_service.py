import random, time
from datetime import datetime, timedelta

from tc_auth.db.models import OTP
from tc_auth.utils.hasher import simple_hash, verify_hash 
from tc_auth.exceptions.error import (
    OTPExpiredError,
    OTPInvalidError,
    OTPNotFoundError,
)


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
                    expires_at = datetime.now() + timedelta(seconds=expiry),
                )
            )

            db.commit()

        return {
            "otp": otp,
            "expires_at": int(time.time()) + expiry,
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

    def cleanup(self):
        with self.session_factory() as db:

            deleted = (
                db.query(OTP)
                .filter(
                    OTP.expires_at < int(time.time())
                )
                .delete()
            )

            db.commit()

            return deleted

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
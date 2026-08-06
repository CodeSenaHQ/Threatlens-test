import smtplib
from email.message import EmailMessage


class EmailService:
    def __init__(self, otp_service):
        print("EMAIL_SERVICE")
        print(id(self))
        self.otp = otp_service

        self.host = None
        self.port = None

        self.username = None
        self.password = None

        self.sender = None
        self.sender_name = None

        self.use_tls = True

    # ==========================================================
    # REGISTER
    # ==========================================================

    def register(
        self,
        *,
        host: str,
        port: int,
        username: str,
        password: str,
        sender: str,
        sender_name: str | None = None,
        use_tls: bool = True,
    ):
        
        self.host = host
        self.port = port

        self.username = username
        self.password = password

        self.sender = sender
        self.sender_name = sender_name

        self.use_tls = use_tls


    # ==========================================================
    # SEND
    # ==========================================================

    def send(
        self,
        *,
        to: str,
        subject: str,
        body: str,
        html: bool = False,
    ):
        message = EmailMessage()

        if self.sender_name:
            message["From"] = (
                f"{self.sender_name} <{self.sender}>"
            )
        else:
            message["From"] = self.sender

        message["To"] = to
        message["Subject"] = subject

        if html:
            message.add_alternative(
                body,
                subtype="html",
            )
        else:
            message.set_content(body)

        smtp = self._connect()

        smtp.send_message(message)
        smtp.quit()

    # ==========================================================
    # OTP
    # ==========================================================

    def send_otp(
        self,
        *,
        email: str,
        purpose: str,
        expiry: int = 300,
    ):
        result = self.otp.create(
            identifier=email,
            purpose=purpose,
            expiry=expiry,
        )

        self.send(
            to=email,
            subject="Verification Code",
            body=(
                f"Your verification code is "
                f"{result['otp']}.\n\n"
                f"It expires in {expiry // 60} minutes."
            ),
        )

        return {
            "expires_at": result["expires_at"],
        }

    # ==========================================================
    # VERIFY EMAIL
    # ==========================================================

    def send_verify_email(
        self,
        *,
        email: str,
    ):
        return self.send_otp(
            email=email,
            purpose="verify_email",
        )

    # ==========================================================
    # LOGIN OTP
    # ==========================================================

    def send_login_otp(
        self,
        email: str,
    ):
        return self.send_otp(
            email=email,
            purpose="login",
        )
    
    # ==========================================================
    # SIGNUP OTP
    # ==========================================================

    def send_signup_otp(
        self,
        email: str,
    ):
        return self.send_otp(
            email=email,
            purpose="signup",
        )
    
    # ==========================================================
    # PRIVATE
    # ==========================================================

    
    def _connect(self):
        if self.use_tls:
            smtp = smtplib.SMTP(
                self.host,
                self.port,
            )
            smtp.starttls()
        else:
            smtp = smtplib.SMTP_SSL(
                self.host,
                self.port,
            )

        smtp.login(
            self.username,
            self.password,
        )

        return smtp
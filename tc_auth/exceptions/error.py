class AuthError(Exception):
    status_code = 400

    def __init__(self, message: str):
        super().__init__(message)


class UserNotFoundError(AuthError):
    status_code = 404

    def __init__(self, field: str, value=None):
        self.field = field
        self.value = value
        super().__init__(f"User not found by {field}")


class InvalidCredentialsError(AuthError):
    status_code = 401

    def __init__(self):
        super().__init__("Invalid credentials")
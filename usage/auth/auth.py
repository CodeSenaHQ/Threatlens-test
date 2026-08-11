from usage import auth

account : dict = auth.get_user.by_email(
    email="testuser@example.com",
    include_password=True,
)



auth.service.create_login_response(
    account=account,
    ip_address="127.0.0.1",
    user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
   )

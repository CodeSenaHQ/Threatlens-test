from test import auth

result = auth.get_user.by_id(account_id=8, include_password=True)
print(result)
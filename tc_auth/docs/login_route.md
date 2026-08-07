# Sign In / Sign Up Routes

Base path: `/tc-auth`

These routes handle signup, login, and email OTP delivery.

Common success payload for signup and login:

```json
{
  "access_token": "jwt-token",
  "token_type": "Bearer",
  "account": {
    "id": 1,
    "uid": "2d7b5f8e-8d8a-4cc4-9c3d-2f2c6c4d2e28",
    "name": "Jane Doe",
    "handle": "jane",
    "email": "jane@example.com",
    "phone": null,
    "avatar_url": null,
    "role": "user",
    "status": null,
    "created_at": "2026-08-07T12:00:00",
    "updated_at": "2026-08-07T12:00:00"
  }
}
```

## POST `/send/email/otp/{purpose}`

Sends an OTP email to the given address.

`purpose` is the OTP purpose key. Typical values are `login`, `signup`, `reset`, or `verify_email`.

### Body

```json
{
  "email": "jane@example.com"
}
```

### Response

```json
{
  "expires_at": 1735689600
}
```

### Fetch example

```js
const res = await fetch(`${baseUrl}/tc-auth/send/email/otp/signup`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: "jane@example.com",
  }),
});

const data = await res.json();
```

## POST `/signup/otp`

Verifies an email OTP with the `signup` purpose and creates a new account.

### Body

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123",
  "otp": "123456",
  "handle": "jane"
}
```

### Response

Returns the standard login payload with `access_token`, `token_type`, and `account`.

### Fetch example

```js
const res = await fetch(`${baseUrl}/tc-auth/signup/otp`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "Jane Doe",
    email: "jane@example.com",
    password: "password123",
    otp: "123456",
    handle: "jane",
  }),
});

const data = await res.json();
```

## POST `/signup/password`

Creates a new account using a password only.

### Body

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "handle": "jane",
  "password": "password123"
}
```

### Response

Returns the standard login payload with `access_token`, `token_type`, and `account`.

### Fetch example

```js
const res = await fetch(`${baseUrl}/tc-auth/signup/password`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "Jane Doe",
    email: "jane@example.com",
    handle: "jane",
    password: "password123",
  }),
});

const data = await res.json();
```

## POST `/login/otp`

Verifies a login OTP and returns a session access token.

### Body

```json
{
  "email": "jane@example.com",
  "otp": "123456"
}
```

### Response

Returns the standard login payload with `access_token`, `token_type`, and `account`.

### Fetch example

```js
const res = await fetch(`${baseUrl}/tc-auth/login/otp`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: "jane@example.com",
    otp: "123456",
  }),
});

const data = await res.json();
```

## POST `/login/password`

Logs a user in with either email or handle plus password.

### Body

```json
{
  "identifier": "jane@example.com",
  "password": "password123"
}
```

`identifier` can be an email address or a handle.

### Response

Returns the standard login payload with `access_token`, `token_type`, and `account`.

### Fetch example

```js
const res = await fetch(`${baseUrl}/tc-auth/login/password`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    identifier: "jane@example.com",
    password: "password123",
  }),
});

const data = await res.json();
```
# Profile Routes

Base path: `/tc-auth`

These routes operate on the current authenticated account.

All routes require `Authorization: Bearer <access_token>`.

## POST `/logout`

Destroys the current session only.

### Body

No request body.

### Response

Returns `null` on success.

### Fetch example

```js
await fetch(`${baseUrl}/tc-auth/logout`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});
```

## POST `/logout-all`

Destroys every session for the current account.

### Body

No request body.

### Response

Returns `null` on success.

### Fetch example

```js
await fetch(`${baseUrl}/tc-auth/logout-all`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});
```

## GET `/me`

Returns the current authenticated user context.

### Response

```json
{
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
  },
  "session": {
    "id": 9,
    "account_id": 1,
    "token_hash": "...",
    "ip_address": "203.0.113.10",
    "user_agent": "Mozilla/5.0",
    "expires_at": "2026-08-08T12:00:00",
    "created_at": "2026-08-07T12:00:00"
  },
  "payload": {
    "aid": 1,
    "sid": 9,
    "token": "...",
    "exp": 1735761600
  }
}
```

### Fetch example

```js
const res = await fetch(`${baseUrl}/tc-auth/me`, {
  method: "GET",
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});

const data = await res.json();
```

## PUT `/update/password`

Updates the password for the current account.

### Body

```json
{
  "password": "new-password123"
}
```

### Response

Returns `null` on success.

### Fetch example

```js
await fetch(`${baseUrl}/tc-auth/update/password`, {
  method: "PUT",
  headers: {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    password: "new-password123",
  }),
});
```
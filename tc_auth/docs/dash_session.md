# Admin Session Routes

Base path: `/tc-auth/session`

All routes in this group require the `superadmin` role.

## GET `/`

Returns every session record.

### Response

```json
[
  {
    "id": 9,
    "account_id": 1,
    "token_hash": "...",
    "ip_address": "203.0.113.10",
    "user_agent": "Mozilla/5.0",
    "expires_at": "2026-08-08T12:00:00",
    "created_at": "2026-08-07T12:00:00"
  }
]
```

### Fetch example

```js
const res = await fetch(`${baseUrl}/tc-auth/session/`, {
  method: "GET",
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});

const data = await res.json();
```

## DELETE `/`

Destroys a single session by id.

### Body

```json
{
  "session_id": 9
}
```

### Response

Returns `null` on success.

### Fetch example

```js
await fetch(`${baseUrl}/tc-auth/session/`, {
  method: "DELETE",
  headers: {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    session_id: 9,
  }),
});
```

## DELETE `/all`

Destroys every session for a given account id.

### Body

```json
{
  "account_id": 1
}
```

### Response

Returns `null` on success.

### Fetch example

```js
await fetch(`${baseUrl}/tc-auth/session/all`, {
  method: "DELETE",
  headers: {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    account_id: 1,
  }),
});
```

## DELETE `/cleanup`

Deletes expired sessions.

### Response

Returns `null` on success.

### Fetch example

```js
await fetch(`${baseUrl}/tc-auth/session/cleanup`, {
  method: "DELETE",
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});
```

## DELETE `/clear`

Deletes all sessions.

### Response

Returns `null` on success.

### Fetch example

```js
await fetch(`${baseUrl}/tc-auth/session/clear`, {
  method: "DELETE",
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});
```
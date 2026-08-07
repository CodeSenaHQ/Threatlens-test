# Admin OAuth Link Routes

Base path: `/tc-auth/oauth`

All routes in this group require the `superadmin` role.

## GET `/`

Returns every OAuth link record.

### Response

```json
[
  {
    "id": 1,
    "account_id": 1,
    "provider": "google",
    "provider_user_id": "123456789",
    "created_at": "2026-08-07T12:00:00"
  }
]
```

### Fetch example

```js
const res = await fetch(`${baseUrl}/tc-auth/oauth/`, {
  method: "GET",
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});

const data = await res.json();
```

## POST `/`

Links an OAuth provider account to a local account.

### Body

```json
{
  "account_id": 1,
  "provider": "google",
  "provider_user_id": "123456789"
}
```

### Response

Returns the created OAuth link record.

### Fetch example

```js
const res = await fetch(`${baseUrl}/tc-auth/oauth/`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    account_id: 1,
    provider: "google",
    provider_user_id: "123456789",
  }),
});

const data = await res.json();
```

## DELETE `/`

Unlinks an OAuth provider from an account.

### Body

```json
{
  "account_id": 1,
  "provider": "google"
}
```

### Response

Returns `null` on success.

### Fetch example

```js
await fetch(`${baseUrl}/tc-auth/oauth/`, {
  method: "DELETE",
  headers: {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    account_id: 1,
    provider: "google",
  }),
});
```
# Admin Account Routes

Base path: `/tc-auth/account`


All routes in this group require the `superadmin` role.

Authentication & permissions:

- Header: `Authorization: Bearer <access_token>`
- The calling account must have `role` == `superadmin`.

Common errors:

- `401 Unauthorized` — invalid token.
- `403 Forbidden` — insufficient role.
- `409 Conflict` — attempting to create or update with duplicate email/handle/phone (see `EmailAlreadyExistsError` / `HandleAlreadyExistsError` / `PhoneAlreadyExistsError`).

## GET `/`

Returns a paginated list of accounts.

Query parameters:

- `page` (int, default=1) — page number (>=1)
- `limit` (int, default=10) — page size (1..100)

Returns every account in the system page-by-page.

### Response

```json
[
  {
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
]
```

### Fetch example

```js
const res = await fetch(`${baseUrl}/tc-auth/account/?page=1&limit=20`, {
  method: "GET",
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});

const data = await res.json();
```

## POST `/`

Creates a new account from an admin context.

### Body

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "handle": "jane",
  "avatar_url": "https://example.com/avatar.png",
  "phone": "+15555550100",
  "role": "user",
  "status": "active",
  "password": "password123"
}
```

### Response

Returns the created account record.

### Fetch example

```js
const res = await fetch(`${baseUrl}/tc-auth/account/`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "Jane Doe",
    email: "jane@example.com",
    handle: "jane",
    avatar_url: "https://example.com/avatar.png",
    phone: "+15555550100",
    role: "user",
    status: "active",
    password: "password123",
  }),
});

const data = await res.json();
```

## PATCH `/`

Performs a super update on an account.

### Body

```json
{
  "account_id": 1,
  "name": "Jane Doe",
  "email": "jane@example.com",
  "handle": "jane",
  "avatar_url": "https://example.com/avatar.png",
  "phone": "+15555550100",
  "role": "admin",
  "status": "active",
  "password": "new-password123"
}
```

Any field except `account_id` is optional.

### Response

Returns the updated account record.

### Fetch example

```js
const res = await fetch(`${baseUrl}/tc-auth/account/`, {
  method: "PATCH",
  headers: {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    account_id: 1,
    role: "admin",
    status: "active",
  }),
});

const data = await res.json();
```

## DELETE `/`

Deletes an account by id.

### Body

```json
{
  "account_id": 1
}
```

### Response

Returns `null` on success.

### Fetch example


## GET `/query`

Performs a quick lookup by a supported field.

Query parameters:

- `field` (string) — the field to query (e.g. `id`, `uid`, `email`, `handle`)
- `value` (string) — the value to search for

### Response

Returns matching account records (array).

### Fetch example

```js
const res = await fetch(`${baseUrl}/tc-auth/account/query?field=email&value=jane%40example.com`, {
  method: "GET",
  headers: { Authorization: `Bearer ${accessToken}` },
});
const results = await res.json();
```
```js
await fetch(`${baseUrl}/tc-auth/account/`, {
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
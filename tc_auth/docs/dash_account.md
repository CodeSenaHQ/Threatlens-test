# Admin Account Routes

Base path: `/tc-auth/account`

All routes in this group require the `superadmin` role.

## GET `/`

Returns every account in the system.

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
const res = await fetch(`${baseUrl}/tc-auth/account/`, {
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
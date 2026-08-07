# Admin OTP Routes

Base path: `/tc-auth/otp`

All routes in this group require the `superadmin` role.

## GET `/`

Returns all OTP records.

### Response

```json
[
  {
    "id": 1,
    "identifier": "jane@example.com",
    "purpose": "login",
    "code_hash": "...",
    "attempts": 0,
    "expires_at": "2026-08-07T12:05:00",
    "created_at": "2026-08-07T12:00:00"
  }
]
```

### Fetch example

```js
const res = await fetch(`${baseUrl}/tc-auth/otp/`, {
  method: "GET",
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});

const data = await res.json();
```

## POST `/`

Creates a new OTP for an identifier and purpose.

### Body

```json
{
  "identifier": "jane@example.com",
  "purpose": "login",
  "expires": 300
}
```

### Response

```json
{
  "otp": "123456",
  "expires_at": 1735689600
}
```

The OTP value is returned directly by the API and should be treated as sensitive.

### Fetch example

```js
const res = await fetch(`${baseUrl}/tc-auth/otp/`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    identifier: "jane@example.com",
    purpose: "login",
    expires: 300,
  }),
});

const data = await res.json();
```

## DELETE `/`

Revokes a specific OTP for an identifier and purpose.

### Body

```json
{
  "identifier": "jane@example.com",
  "purpose": "login"
}
```

### Response

```json
true
```

The response is `true` when a record was deleted and `false` when nothing matched.

### Fetch example

```js
const res = await fetch(`${baseUrl}/tc-auth/otp/`, {
  method: "DELETE",
  headers: {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    identifier: "jane@example.com",
    purpose: "login",
  }),
});

const data = await res.json();
```

## DELETE `/cleanup`

Deletes expired OTP records.

### Response

Returns the number of deleted rows.

### Fetch example

```js
const res = await fetch(`${baseUrl}/tc-auth/otp/cleanup`, {
  method: "DELETE",
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});

const deletedCount = await res.json();
```

## DELETE `/clear`

Deletes all OTP records.

### Response

Returns `null` on success.

### Fetch example

```js
await fetch(`${baseUrl}/tc-auth/otp/clear`, {
  method: "DELETE",
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});
```
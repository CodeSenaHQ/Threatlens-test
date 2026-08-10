# Admin OAuth Link Routes

Base path: `/tc-auth/oauth`


All routes in this group require the `superadmin` role.

Authentication:

- Header: `Authorization: Bearer <access_token>`

Provider notes:

- Ensure `provider` values match those used by the OAuth adapters (e.g. `google`, `github`).
- Linking an OAuth provider that already exists for a user will raise database uniqueness errors.

## GET `/`

Returns a paginated list of OAuth link records.

Query parameters:

- `page` (int, default=1) — page number (>=1)
- `limit` (int, default=10) — page size (1..100)

Returns every OAuth link record page-by-page.

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
const res = await fetch(`${baseUrl}/tc-auth/oauth/?page=1&limit=20`, {
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

## GET `/query`

Performs a lookup for OAuth link records.

Query parameters:

- `field` (string) — supported fields (e.g. `id`, `account_id`, `provider`, `provider_user_id`)
- `value` (string) — value to match

### Response

Returns matching OAuth link records (array).

### Fetch example

```js
const res = await fetch(`${baseUrl}/tc-auth/oauth/query?field=account_id&value=1`, {
  method: "GET",
  headers: { Authorization: `Bearer ${accessToken}` },
});
const results = await res.json();
```
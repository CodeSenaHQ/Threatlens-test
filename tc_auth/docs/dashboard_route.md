# Dashboard Routes

Base path: `/tc-auth/config`

All routes in this group require an authenticated user with the `superadmin` role.

Authentication:

- Header: `Authorization: Bearer <access_token>`
- Token must be a valid access token created by the library (see login responses).

Common error responses:

- `401 Unauthorized` — invalid or expired token (see `InvalidTokenError`).
- `403 Forbidden` — the authenticated account is not `superadmin` (permission denied).
- `400` / `422` — invalid request body or validation failures.

## GET `/load/`

Returns the current in-memory configuration for email, GitHub OAuth, Google OAuth, and JWT.

### Response

```json
{
	"email": {
		"host": "smtp.example.com",
		"port": 587,
		"username": "mailer@example.com",
		"password": "***",
		"sender": "noreply@example.com",
		"sender_name": "Auth Module",
		"use_tls": true
	},
	"github": {
		"client_id": "...",
		"client_secret": "...",
		"redirect_uri": "https://app.example.com/tc-auth/github/callback"
	},
	"google": {
		"client_id": "...",
		"client_secret": "...",
		"redirect_uri": "https://app.example.com/tc-auth/google/callback"
	},
	"jwt": {
		"secret_key": "...",
		"algorithm": "HS256",
		"session_duration_days": 1
	}
	,
	"redirect": {
		"frontend_url": "https://app.example.com/auth/callback"
	}
}
```

### Fetch example

```js
const res = await fetch(`${baseUrl}/tc-auth/config/load/`, {
	method: "GET",
	headers: {
		Authorization: `Bearer ${accessToken}`,
	},
});

const data = await res.json();
```

Notes & conditions:

- Config changes are stored in-memory on the running service instance. To make them persistent, wire the config calls to your persistent store, or re-run `config` on startup from environment variables.
- Keep `secret_key` and `client_secret` values confidential and rotate them where appropriate.

## POST `/email`

Configures the email service.

### Body

```json
{
	"host": "smtp.example.com",
	"port": 587,
	"username": "mailer@example.com",
	"password": "secret",
	"sender": "noreply@example.com",
	"sender_name": "Auth Module",
	"use_tls": true
}
```

### Response

Returns `null` on success.

### Fetch example

```js
await fetch(`${baseUrl}/tc-auth/config/email`, {
	method: "POST",
	headers: {
		Authorization: `Bearer ${accessToken}`,
		"Content-Type": "application/json",
	},
	body: JSON.stringify({
		host: "smtp.example.com",
		port: 587,
		username: "mailer@example.com",
		password: "secret",
		sender: "noreply@example.com",
		sender_name: "Auth Module",
		use_tls: true,
	}),
});
```

## GET `/counts`

Returns basic dashboard counts (users, active sessions, oauth links, etc.).

### Response

```json
{
	"users": 123,
	"sessions": 42,
	"oauth_links": 7,
	"otps": 3
}
```

### Fetch example

```js
const res = await fetch(`${baseUrl}/tc-auth/config/counts`, {
	method: "GET",
	headers: { Authorization: `Bearer ${accessToken}` },
});
const counts = await res.json();
```

## POST `/redirect`

Sets the frontend OAuth redirect/base callback URL used by the OAuth flow.

### Body

```json
{
	"frontend_url": "https://app.example.com/auth/callback"
}
```

### Response

Returns `null` on success.

### Fetch example

```js
await fetch(`${baseUrl}/tc-auth/config/redirect`, {
	method: "POST",
	headers: {
		Authorization: `Bearer ${accessToken}`,
		"Content-Type": "application/json",
	},
	body: JSON.stringify({ frontend_url: "https://app.example.com/auth/callback" }),
});
```

## POST `/github`

Configures GitHub OAuth.

### Body

```json
{
	"client_id": "...",
	"client_secret": "...",
	"redirect_uri": "https://app.example.com/tc-auth/github/callback"
}
```

### Response

Returns `null` on success.

### Fetch example

```js
await fetch(`${baseUrl}/tc-auth/config/github`, {
	method: "POST",
	headers: {
		Authorization: `Bearer ${accessToken}`,
		"Content-Type": "application/json",
	},
	body: JSON.stringify({
		client_id: "...",
		client_secret: "...",
		redirect_uri: "https://app.example.com/tc-auth/github/callback",
	}),
});
```

## POST `/google`

Configures Google OAuth.

### Body

```json
{
	"client_id": "...",
	"client_secret": "...",
	"redirect_uri": "https://app.example.com/tc-auth/google/callback"
}
```

### Response

Returns `null` on success.

### Fetch example

```js
await fetch(`${baseUrl}/tc-auth/config/google`, {
	method: "POST",
	headers: {
		Authorization: `Bearer ${accessToken}`,
		"Content-Type": "application/json",
	},
	body: JSON.stringify({
		client_id: "...",
		client_secret: "...",
		redirect_uri: "https://app.example.com/tc-auth/google/callback",
	}),
});
```

## POST `/jwt`

Configures JWT signing and session duration.

### Body

```json
{
	"secret_key": "super-secret",
	"algorithm": "HS256",
	"session_duration_days": 7
}
```

### Response

Returns `null` on success.

### Fetch example

```js
await fetch(`${baseUrl}/tc-auth/config/jwt`, {
	method: "POST",
	headers: {
		Authorization: `Bearer ${accessToken}`,
		"Content-Type": "application/json",
	},
	body: JSON.stringify({
		secret_key: "super-secret",
		algorithm: "HS256",
		session_duration_days: 7,
	}),
});
```

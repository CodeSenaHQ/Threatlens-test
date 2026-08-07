# Dashboard Routes

Base path: `/tc-auth/config`

All routes in this group require an authenticated user with the `superadmin` role.

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

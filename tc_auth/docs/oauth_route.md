# OAuth Login Routes

Base path: `/tc-auth`

These routes start and finish the Google and GitHub OAuth flow.

Authentication & flow notes:

- The `/google/login` and `/github/login` endpoints respond with a redirect to the provider's authorization URL. In browser-based frontends prefer using `window.location` or a popup.
- The provider will redirect back to `/tc-auth/google/callback` or `/tc-auth/github/callback` with a code. The backend exchanges the code and returns the standard login payload.
- The OAuth client credentials and `redirect_uri` are configured using the admin endpoints under `/tc-auth/config`.

Provider registration requirements (frontend):

- Register the redirect URI exactly as configured in the dashboard (`redirect_uri`). Use HTTPS in production.
- For GitHub: register the `Authorization callback URL` in your GitHub OAuth App settings.
- For Google: register the `Authorized redirect URI` in the Google Cloud Console OAuth 2.0 Client IDs.

Errors & edge cases:

- `400` / `422` — malformed callback or missing query args.
- `401` — if token exchange or internal verification fails; ensure client secrets match.

## GET `/google/login`

Starts the Google OAuth redirect flow.

### Response

Usually a redirect response from the OAuth client.

### Fetch example

```js
await fetch(`${baseUrl}/tc-auth/google/login`, {
  method: "GET",
  redirect: "manual",
});
```

## GET `/google/callback`

OAuth provider callback endpoint for Google.

The provider sends query parameters to this route after the user approves access. The route exchanges the authorization code, creates or links the account, then returns the standard login payload.

### Response

```json
{
  "access_token": "jwt-token",
  "token_type": "Bearer",
  "account": {
    "id": 1,
    "name": "Jane Doe",
    "email": "jane@example.com"
  }
}
```

### Fetch example

```js
const res = await fetch(`${baseUrl}/tc-auth/google/callback?code=provider-code`, {
  method: "GET",
  credentials: "include",
});

const data = await res.json();
```

## GET `/github/login`

Starts the GitHub OAuth redirect flow.

### Response

Usually a redirect response from the OAuth client.

### Fetch example

```js
await fetch(`${baseUrl}/tc-auth/github/login`, {
  method: "GET",
  redirect: "manual",
});
```

## GET `/github/callback`

OAuth provider callback endpoint for GitHub.

The provider sends query parameters to this route after the user approves access. The route exchanges the authorization code, creates or links the account, then returns the standard login payload.

### Response

```json
{
  "access_token": "jwt-token",
  "token_type": "Bearer",
  "account": {
    "id": 1,
    "name": "Jane Doe",
    "email": "jane@example.com"
  }
}
```

### Fetch example

```js
const res = await fetch(`${baseUrl}/tc-auth/github/callback?code=provider-code`, {
  method: "GET",
  credentials: "include",
});

const data = await res.json();
```
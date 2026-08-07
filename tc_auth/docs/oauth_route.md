# OAuth Login Routes

Base path: `/tc-auth`

These routes start and finish the Google and GitHub OAuth flow.

The login endpoints usually redirect the browser to the provider. In a frontend app, navigation is typically a better fit than raw fetch, but fetch examples are included here for completeness.

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
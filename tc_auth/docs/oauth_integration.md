
# OAuth Frontend Integration Guide

This guide explains how to integrate the `tc_auth` OAuth endpoints with a browser-based frontend (React, Vue, plain JS).

Prerequisites:

- Admin must set the OAuth provider configuration via `/tc-auth/config/github` or `/tc-auth/config/google` with `client_id`, `client_secret`, and `redirect_uri`.
- Register the `redirect_uri` exactly in the provider dashboard (GitHub/GCP). Use HTTPS in production and include the exact path.

Typical frontend flow (recommended):

1. User clicks "Sign in with Google/GitHub".
2. Frontend navigates the browser to the backend start endpoint, e.g. `GET /tc-auth/google/login`.
   - Use `window.location.href = backend + '/tc-auth/google/login'` for full-page redirect, or open a popup window for a popup flow.
3. Backend redirects the browser to the provider authorization URL.
4. User authenticates at the provider and approves scopes.
5. Provider redirects the browser back to the backend callback, e.g. `/tc-auth/google/callback?code=...`.
   - The backend exchanges the code, creates/links an account, creates a session, and returns the standard login JSON payload.
6. If the backend returns JSON directly on the callback, the frontend can capture it when using a popup. For full-page redirects the backend response will land in the browser and you should implement a post-redirect flow that stores the `access_token` and navigates the user into the app.

Popup integration example (simplified):

```js
function openOAuthPopup(url) {
  return new Promise((resolve, reject) => {
    const popup = window.open(url, 'oauth', 'width=600,height=800');

    const interval = setInterval(() => {
      try {
        // When provider redirects back to backend callback which responds JSON,
        // the popup window will be same-origin and we can read it.
        if (!popup || popup.closed) {
          clearInterval(interval);
          reject(new Error('Popup closed'));
        }
      } catch (e) {}
    }, 500);
    // In production implement a secure postMessage-based flow.
  });
}
```

Important frontend considerations:

- Register `redirect_uri` in the provider dashboard exactly (trailing slash, protocol, and host must match).
- Do not embed `client_secret` in frontend code — secrets must remain on the server.
- Store `access_token` securely (recommend HttpOnly cookie set by backend, or localStorage if necessary but be aware of XSS risks).
- Use `state` or other CSRF protections when initiating OAuth flows; `authlib` and provider SDKs often include support for this.
- Use `redirect: 'manual'` or popup patterns carefully — providers and browsers differ in handling third-party cookies and same-site rules.

Troubleshooting:

- 400/401 errors during callback: confirm `client_id`, `client_secret`, and `redirect_uri` match the provider registration.
- Missing email from provider: some providers require explicit scope to return an email; fallback code in the backend tries to fetch emails for GitHub.

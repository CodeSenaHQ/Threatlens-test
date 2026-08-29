# Chat API Routes

Base URL:

- http://localhost:8000

These routes are defined in `backend/SITE_MODULE/api/chat_route.py` and are mounted under the `/chats` prefix.

---

## 1) Save chat history

### POST /chats/history

Stores a list of chat messages associated with a chat ID.

#### Parameters

No query parameters.

#### Request body

```json
{
  "chat_id": 12,
  "messages": [
    {
      "role": "user",
      "content": "Explain the repo structure"
    },
    {
      "role": "assistant",
      "content": "This project contains a backend, site module, and frontend."
    }
  ]
}
```

Fields:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| chat_id | integer | Yes | Target chat ID |
| messages | array | Yes | Chat message list, each with `role` and `content` |

Each message object may include optional fields such as `tool_calls` and `tool_call_id`.

#### Response

```json
{
  "chat_id": 12,
  "saved": 2
}
```

#### Sample fetch

```js
fetch("http://localhost:8000/chats/history", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    chat_id: 12,
    messages: [
      { role: "user", content: "Explain the repo structure" },
      { role: "assistant", content: "This project contains a backend, site module, and frontend." }
    ]
  })
})
  .then((res) => res.json())
  .then((data) => console.log(data));
```

---

## 2) Get chat history

### GET /chats/{chat_id}/history

Fetches paginated chat history for a given chat.

#### Parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| chat_id | integer | Yes | Chat session ID |
| page | integer | No | Page number, default `1`, minimum `1` |
| limit | integer | No | Page size, default `10`, range `1-100` |

#### Request body

No request body.

#### Response

```json
{
  "page": 1,
  "limit": 10,
  "data": [
    {
      "id": 1,
      "chat_id": 12,
      "message": {
        "role": "user",
        "content": "Explain the repo structure"
      },
      "created_at": "2026-08-30T12:00:00Z"
    }
  ]
}
```

#### Sample fetch

```js
fetch("http://localhost:8000/chats/12/history?page=1&limit=10")
  .then((res) => res.json())
  .then((data) => console.log(data));
```

---

## 3) Create a chat

### POST /chats

Creates a new chat for the authenticated account.

#### Parameters

No query parameters.

#### Request body

```json
{
  "title": "Repository Review",
  "model": "gpt-4o-mini"
}
```

Fields:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| title | string | No | Chat title |
| model | string | No | Model identifier |

#### Response

Example response from the database-backed chat creation flow:

```json
{
  "id": 12,
  "account_id": 3,
  "title": "Repository Review",
  "model": "gpt-4o-mini",
  "created_at": "2026-08-30T12:00:00Z",
  "updated_at": "2026-08-30T12:00:00Z"
}
```

#### Sample fetch

```js
fetch("http://localhost:8000/chats", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer <token>"
  },
  body: JSON.stringify({
    title: "Repository Review",
    model: "gpt-4o-mini"
  })
})
  .then((res) => res.json())
  .then((data) => console.log(data));
```

---

## 4) Get all chats

### GET /chats

Returns all chats for the authenticated account.

#### Parameters

No query parameters.

#### Request body

No request body.

#### Response

```json
[
  {
    "id": 12,
    "account_id": 3,
    "title": "Repository Review",
    "model": "gpt-4o-mini"
  },
  {
    "id": 13,
    "account_id": 3,
    "title": "Security Review",
    "model": "claude-3-5-sonnet"
  }
]
```

#### Sample fetch

```js
fetch("http://localhost:8000/chats", {
  headers: {
    "Authorization": "Bearer <token>"
  }
})
  .then((res) => res.json())
  .then((data) => console.log(data));
```

---

## 5) Delete a chat

### DELETE /chats/{chat_id}

Deletes a chat and its history for the authenticated account.

#### Parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| chat_id | integer | Yes | Chat ID to delete |

#### Request body

No request body.

#### Response

```json
{
  "success": true
}
```

#### Sample fetch

```js
fetch("http://localhost:8000/chats/12", {
  method: "DELETE",
  headers: {
    "Authorization": "Bearer <token>"
  }
})
  .then((res) => res.json())
  .then((data) => console.log(data));
```

---

## Notes

- These routes require the authenticated user context via the backend auth dependency.
- `Authorization: Bearer <token>` is expected on routes that call `auth.deps.get_current`.

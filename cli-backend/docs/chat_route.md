# Chat API Routes

Base URL for local CLI usage:

- http://localhost:1234

These routes are defined in `cli-backend/api/chat_route.py` and are mounted under the `/chats` prefix.

---

## 1) Create a chat

### POST /chats

Creates a new chat session.

#### Parameters

No query parameters.

#### Request body

```json
{
  "title": "Repository review",
  "model": "anthropic/claude-3.5-sonnet"
}
```

Fields:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| title | string | No | Friendly title for the chat |
| model | string | No | LLM model identifier used for the chat |

#### Response

The upstream service returns the created chat object. Example shape:

```json
{
  "id": 1,
  "title": "Repository review",
  "model": "anthropic/claude-3.5-sonnet",
  "created_at": "2026-08-30T10:00:00Z"
}
```

Exact fields can vary depending on the backend implementation, but the route usually returns the created chat record.

#### Sample fetch

```js
fetch("http://localhost:1234/chats", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    title: "Repository review",
    model: "anthropic/claude-3.5-sonnet"
  })
})
  .then((res) => res.json())
  .then((data) => console.log(data));
```

---

## 2) List chats

### GET /chats

Returns all chat sessions available to the current user/session.

#### Parameters

No query parameters.

#### Request body

No request body.

#### Response

Example JSON:

```json
[
  {
    "id": 1,
    "title": "Repository review",
    "model": "anthropic/claude-3.5-sonnet"
  },
  {
    "id": 2,
    "title": "Security check",
    "model": "gpt-4o-mini"
  }
]
```

#### Sample fetch

```js
fetch("http://localhost:1234/chats")
  .then((res) => res.json())
  .then((data) => console.log(data));
```

---

## 3) Delete a chat

### DELETE /chats/{chat_id}

Deletes a chat by ID.

#### Parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| chat_id | integer | Yes | Chat ID to delete |

#### Request body

No request body.

#### Response

The upstream service typically returns the deleted chat record or a success payload. Example:

```json
{
  "status": "deleted",
  "chat_id": 1
}
```

#### Sample fetch

```js
fetch("http://localhost:1234/chats/1", {
  method: "DELETE"
})
  .then((res) => res.json())
  .then((data) => console.log(data));
```

---

## 4) Save chat history

### POST /chats/history

Stores a chat history payload for the specified chat ID.

#### Parameters

No query parameters.

#### Request body

```json
{
  "chat_id": 1,
  "messages": [
    {
      "role": "user",
      "content": "Summarize the repository structure"
    },
    {
      "role": "assistant",
      "content": "This project has a CLI backend and a web frontend."
    }
  ]
}
```

Fields:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| chat_id | integer | Yes | Target chat session ID |
| messages | array | Yes | List of chat messages to store |

Each message item is a generic object and can include the usual chat fields such as `role`, `content`, and optional `tool_calls` / `tool_call_id` depending on the backend schema.

#### Response

Example JSON:

```json
{
  "status": "saved",
  "chat_id": 1
}
```

#### Sample fetch

```js
fetch("http://localhost:1234/chats/history", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    chat_id: 1,
    messages: [
      { role: "user", content: "Summarize the repository structure" },
      { role: "assistant", content: "This project has a CLI backend and a web frontend." }
    ]
  })
})
  .then((res) => res.json())
  .then((data) => console.log(data));
```

---

## 5) Get chat history

### GET /chats/{chat_id}/history

Retrieves saved chat history for a chat session.

#### Parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| chat_id | integer | Yes | Chat session ID |
| page | integer | No | Pagination page number; default `1`, minimum `1` |
| limit | integer | No | Number of records per page; default `10`, range `1-100` |

#### Request body

No request body.

#### Response

Example JSON:

```json
{
  "chat_id": 1,
  "page": 1,
  "limit": 10,
  "messages": [
    {
      "role": "user",
      "content": "Summarize the repository structure"
    },
    {
      "role": "assistant",
      "content": "This project has a CLI backend and a web frontend."
    }
  ]
}
```

#### Sample fetch

```js
fetch("http://localhost:1234/chats/1/history?page=1&limit=10")
  .then((res) => res.json())
  .then((data) => console.log(data));
```

---

## Notes

- This router expects the CLI to already have a valid JWT from the auth flow.
- The actual chat payloads and upstream response fields depend on the backend service implementation behind the CLI, but the route contract above matches the current FastAPI definitions.

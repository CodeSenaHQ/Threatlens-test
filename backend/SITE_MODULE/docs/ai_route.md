# AI API Routes

Base URL:

- http://localhost:8000

These routes are defined in `backend/SITE_MODULE/api/ai_route.py` and are mounted under the `/ai` prefix.

---

## 1) Chat with AI

### POST /ai/chat

Sends a prompt to the AI backend and optionally streams the response.

#### Parameters

No query parameters.

#### Request body

```json
{
  "chat_id": 12,
  "prompt": "Summarize the repository structure and list risks.",
  "stream": false
}
```

Fields:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| chat_id | integer | Yes | Chat session ID associated with the prompt |
| prompt | string | Yes | User message to send to the AI |
| stream | boolean | No | If `true`, returns a streaming text response; default `false` |

#### Response

When `stream` is `false`, the endpoint returns:

```json
{
  "text": "This project contains backend, frontend, and AI service modules. Key risks include auth exposure, repository sync issues, and model usage tracking."
}
```

When `stream` is `true`, the route returns a `StreamingResponse` with `text/plain` content, i.e. a streamed text response rather than JSON.

#### Sample fetch

```js
fetch("http://localhost:8000/ai/chat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    chat_id: 12,
    prompt: "Summarize the repository structure and list risks.",
    stream: false
  })
})
  .then((res) => res.json())
  .then((data) => console.log(data));
```

Streaming example:

```js
fetch("http://localhost:8000/ai/chat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    chat_id: 12,
    prompt: "Generate a full project summary stream.",
    stream: true
  })
})
  .then((res) => res.text())
  .then((text) => console.log(text));
```

---

## Notes

- This route uses the AI builder service behind the scenes.
- `stream` mode is handled with `StreamingResponse` and returns plain text, not JSON.

# Pastebin‑Lite

A minimal Pastebin‑like web application where users can create text pastes and share a URL to view them. Pastes can optionally expire after a given time (TTL) or after a limited number of views.

This project was built as part of a take‑home assignment and is designed to pass automated API and UI tests.

---

## Features

* Create a paste with arbitrary text
* Generate a shareable URL for each paste
* View pastes via API or browser
* Optional constraints:

  * Time‑to‑Live (TTL)
  * Maximum view count
* Automatic invalidation once constraints are met
* Deterministic time handling for testing

---

## Tech Stack

* **Framework:** Next.js (App Router)
* **Language:** TypeScript
* **Runtime:** Node.js
* **Persistence:** Redis / KV store (persistent across serverless requests)
* **Deployment:** Vercel

---

## API Routes

### Health Check

`GET /api/healthz`

Returns service health and persistence availability.

**Response**

```json
{ "ok": true }
```

---

### Create a Paste

`POST /api/pastes`

**Request Body**

```json
{
  "content": "Hello world",
  "ttl_seconds": 60,
  "max_views": 5
}
```

**Rules**

* `content` is required and must be non‑empty
* `ttl_seconds` (optional) must be an integer ≥ 1
* `max_views` (optional) must be an integer ≥ 1

**Response**

```json
{
  "id": "abc123",
  "url": "https://your-app.vercel.app/p/abc123"
}
```

---

### Fetch a Paste (API)

`GET /api/pastes/:id`

**Response (200)**

```json
{
  "content": "Hello world",
  "remaining_views": 4,
  "expires_at": "2026-01-01T00:00:00.000Z"
}
```

* Each successful fetch counts as one view
* Returns **404** if the paste is missing, expired, or view‑limit exceeded

---

### View a Paste (HTML)

`GET /p/:id`

* Returns an HTML page containing the paste content
* Paste content is rendered safely (no script execution)
* Returns **404** if unavailable

---

## Deterministic Time Testing

For automated testing of expiry logic:

* Set environment variable:

```bash
TEST_MODE=1
```

* Send request header:

```text
x-test-now-ms: <milliseconds since epoch>
```

When enabled, this timestamp is used instead of system time **only for expiry checks**.

---

## Persistence Layer

This project uses a **persistent KV / Redis store** to ensure data survives across serverless function invocations. In‑memory storage is intentionally avoided to remain compatible with Vercel’s execution model and automated tests.

---

## Running Locally

### Prerequisites

* Node.js ≥ 18
* Redis / KV service (local or cloud)

### Setup

```bash
git clone <your-repo-url>
cd pastebin-lite
npm install
```

Create a `.env.local` file:

```env
KV_REST_API_URL=your_kv_url
KV_REST_API_TOKEN=your_kv_token
```

### Start Development Server

```bash
npm run dev
```

The app will be available at:

```
http://localhost:3000
```

---

## Deployment

The app is deployed on **Vercel** and requires no manual database migrations.

Deployment URL:

```
https://your-app.vercel.app
```

---

## Design Decisions

* **Serverless‑safe persistence:** Avoided global mutable state to support concurrent requests
* **Strict validation:** All invalid inputs return consistent 4xx JSON errors
* **Fail‑fast expiry:** Pastes become unavailable immediately when any constraint triggers
* **Security:** Paste content is safely rendered to prevent script execution (XSS)

---

## Repository Notes

* No secrets or credentials are committed
* No hard‑coded localhost URLs
* README documents setup, persistence, and usage as required

---

## Author Notes

This project focuses on correctness, robustness, and testability over UI styling, in line with the assignment’s evaluation criteria.

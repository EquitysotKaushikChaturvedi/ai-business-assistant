# Backend Contract - Authentication & Health

## Headers

### Request Headers
- `Authorization`: Bearer token (for protected endpoints)
- `Idempotency-Key`: (Optional) UUID for safe retries

### Response Headers
- `X-Correlation-ID`: UUID to track the request across services. Useful for diagnostics.
- `Retry-After`: (Optional) Seconds to wait before retrying (on 429/503).

## Endpoints

### `POST /auth/token`
- **Description**: Authenticate user and get access token.
- **Input**: `username` (email), `password` (form-data)
- **Output**: 
  - `200 OK`: `{ "access_token": "...", "token_type": "bearer" }`
  - `401 Unauthorized`: Incorrect credentials
  - `429 Too Many Requests`: Rate limit exceeded
  - `500 Internal Server Error`: Server failure

### `GET /health`
- **Description**: Check API health status.
- **Output**: 
  - `200 OK`: `{ "status": "ok" }`

# Security & Deployment Checklist

## Token Handling
- [ ] **JWTs**: Use short-lived access tokens (e.g., 15-30 mins).
- [ ] **Storage**: Store tokens in `localStorage` for MVP, but migrate to HttpOnly cookies for production refresh tokens.
- [ ] **Transmission**: Always send tokens in `Authorization: Bearer` header over HTTPS.

## Production Deployment
- [ ] **HTTPS**: Enforce HTTPS for all traffic. Redirect HTTP to HTTPS.
- [ ] **WSS**: Use Secure WebSocket (`wss://`) for chat.
- [ ] **CORS**: Restrict `allow_origins` to specific production domains (no `*`).
- [ ] **Secrets**: Set `SECRET_KEY`, `OPENAI_API_KEY`, and `DATABASE_URL` via environment variables. Never commit `.env`.

## Input Sanitization & Safety
- [ ] **Frontend**: React escapes content by default. Use `react-markdown` safely for chat.
- [ ] **Backend**: Validate all Pydantic schemas. Sanitize business descriptions before prompt injection.
- [ ] **Prompt Injection**: Truncate business context if too long. Use strict system prompts.

## Monitoring & Maintenance
- [ ] **Rate Limiting**: Implement API throttling (e.g., `slowapi`) for `/chat` and `/auth` endpoints.
- [ ] **Logging**: Log errors but redact PII and tokens.
- [ ] **Backups**: Schedule daily database backups.

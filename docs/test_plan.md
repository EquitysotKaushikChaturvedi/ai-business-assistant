# Test Plan

## Unit Tests
- [ ] **Frontend Validation**: Test `validate()` functions in Login/Register for edge cases (empty strings, invalid emails).
- [ ] **Backend Schemas**: Test Pydantic models reject invalid data types.
- [ ] **System Prompt**: Test `generate_system_prompt` includes all business fields correctly.

## Integration Tests
### Auth Flow
1. **Register**: Create new user -> Verify 200 OK -> Verify DB entry.
2. **Duplicate Register**: Try same email -> Verify 400 Bad Request.
3. **Login**: Valid credentials -> Verify 200 OK + JWT.
4. **Invalid Login**: Wrong password -> Verify 401 Unauthorized.

### Business Profile
1. **Create**: POST /business/ -> Verify 200 OK.
2. **Update**: PUT /business/ -> Verify fields updated.
3. **Get**: GET /business/ -> Verify data matches.

### Chat Flow
1. **Connect**: WebSocket connection with valid token -> Open.
2. **Message**: Send "Hello" -> Receive JSON reply.
3. **Context**: Send message asking about business -> Verify reply contains business name/services.
4. **Disconnect**: Close connection -> Verify clean close.

## Accessibility Tests
- [ ] **Keyboard Nav**: Tab through Login, Register, Dashboard, Chat. Verify focus rings.
- [ ] **Screen Reader**: Verify `aria-label` on inputs and buttons.
- [ ] **Contrast**: Check text colors against backgrounds (WCAG AA).

## Performance Tests
- [ ] **Load**: Simulate 50 concurrent WebSocket connections.
- [ ] **Latency**: Measure time to first token (TTFT) from AI.

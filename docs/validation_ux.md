# Validation & UX Guidelines

## Centralized Validation Rules

### Authentication
- **Email**: Must match standard email regex `/\S+@\S+\.\S+/`.
- **Password**:
  - Min 8 characters.
  - At least 1 number.
  - At least 1 uppercase letter.
  - At least 1 symbol.
- **Confirm Password**: Must match Password exactly.

### Business Profile
- **Name**: Required, trimmed, max 100 chars.
- **Description**: Required, max 500 chars.
- **Services**: Required, comma-separated list. Parsed into array on save.

## Error Display Conventions
- **Inline Errors**: Displayed below the invalid field in red (`text-red-600`).
- **Global Errors**: Displayed at the top of the form in a red alert box (`bg-red-50`).
- **Accessibility**: All error messages should be associated with fields via `aria-describedby` or live regions.

## UX Patterns
- **Loading States**: Disable buttons and show spinner/text ("Saving...", "Signing in...") during async actions.
- **Autosave**: Business profile saves to local storage every 1 second after changes.
- **Rate Limiting**: If API returns 429, show "Too many attempts. Try again in X minutes."
- **Typing Indicator**: Show animated dots when AI is generating a response.

## Accessibility Checklist
- [ ] All inputs have associated `<label>` elements.
- [ ] Focus management on route changes and modal opens.
- [ ] Color contrast ratio > 4.5:1 for text.
- [ ] Keyboard navigation support for all interactive elements.

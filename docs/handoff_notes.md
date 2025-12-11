# Handoff Notes

## Design System
- **Colors**:
  - Primary: Indigo 600 (`#4F46E5`)
  - Secondary: Indigo 500 (`#6366F1`)
  - Accent: Emerald 500 (`#10B981`)
  - Background: Gray 50 (`#F9FAFB`)
- **Typography**: Inter (Google Fonts). Headings: SemiBold, Body: Regular.
- **Spacing**: Tailwind default scale (4px base). Common padding: `p-6`, `p-8`.

## Component Library
- **Buttons**: Rounded-xl, shadow-sm, transform hover effect (`scale-101`).
- **Inputs**: Rounded-xl, border-gray-300, focus ring primary.
- **Cards**: White bg, rounded-2xl, shadow-sm/md.

## Responsive Behavior
- **Mobile (< 640px)**:
  - Navbar collapses to hamburger.
  - Dashboard grid stacks vertically.
  - Chat input fixed to bottom.
- **Desktop**:
  - Navbar expands.
  - Dashboard 2-column grid (Main 2/3, Sidebar 1/3).

## Accessibility Requirements
- All interactive elements must have `:focus-visible` styles.
- Use semantic HTML (`<nav>`, `<main>`, `<footer>`, `<h1>`).
- Chat messages must be in a live region or appended to a container with `role="log"`.

## Performance Targets
- **Lighthouse**: >90 on Accessibility and Best Practices.
- **FCP**: < 1.5s.
- **CLS**: < 0.1.

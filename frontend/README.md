# Business AI Chat - Frontend

This directory contains the React application built with Vite. It provides the user interface for logging in, managing profiles, and chatting with the AI.

## Project Structure & File Explanations

### Source Code (`src/`)
- **`api.js`**: Configures the Axios HTTP client. It loads the Backend URL from environment variables and sets up headers.
- **`App.jsx`**: The main component that sets up Routing (React Router). It defines which page shows up for which URL (e.g., `/login` vs `/dashboard`).
- **`index.css`**: Global styles and Tailwind CSS directives.
- **`index.jsx`**: The request entry point. Mounts the React application into the HTML page.

### Pages (`src/pages/`)
- **`Login.jsx`**: A comprehensive login page with status indicators, error handling, and auto-retry logic.
- **`Register.jsx`**: User registration form.
- **`Dashboard.jsx`**: The main landing page after login. Shows business overview.
- **`BusinessProfile.jsx`**: A form to edit business details (Name, Type, Goals). These details are sent to the AI to customize its responses.
- **`Chat.jsx`**: The real-time chat interface. It manages the WebSocket connection, displays message history bubbles, and handles user input.

### Components (`src/components/`)
- **`ChatBubble.jsx`**: Reusable component to render a single chat message (styled differently for User vs AI).
- **`Input.jsx`**: Reusable text input field.
- **`Layout.jsx`** (if present): Common page structure (sidebar, header).

### Hooks (`src/hooks/`)
- **`useAuth.js`**: A custom React Hook that manages the user's login state (reading the token from local storage, checking expiration).

### Configuration Files
- **`package.json`**: Lists Node.js dependencies (e.g., `react`, `vite`, `tailwindcss`).
- **`vercel.json`**: Configuration for Vercel deployment. Contains a "rewrite" rule to ensure the Single Page App works correctly on refresh.
- **`vite.config.js`**: Configuration for the Vite build tool.
- **`tailwind.config.js`**: Configuration for Tailwind CSS styling.

## Deployment Setup (Vercel)

- **Framework Preset**: Vite
- **Root Directory**: `frontend`
- **Environment Variables**:
    - `VITE_API_URL`: The URL of your deployed Backend (e.g., `https://your-app.onrender.com`).

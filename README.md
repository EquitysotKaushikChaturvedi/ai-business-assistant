# Business AI Chat Platform

A production-ready AI Business Assistant platform.
- **Backend:** FastAPI (Python) running on Render.
- **Frontend:** React + Vite (JavaScript) running on Vercel.
- **Database:** PostgreSQL (Production) / SQLite (Local).
- **AI:** Google Gemini Pro.

## Documentation

- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)**: Detailed guide on common issues (Login failures, WebSocket errors) and how they were fixed.
- **[backend/README.md](./backend/README.md)**: Detailed explanation of the Backend code structure and files.
- **[frontend/README.md](./frontend/README.md)**: Detailed explanation of the Frontend code structure and files.

## Admin / Developer Notes

The system requires `argon2-cffi` and `websockets` libraries to function correctly. Ensure `requirements.txt` is always up to date.
The Login system uses a secure HTTP-only flow (when possible) or manual Token management.
The Chat system uses WebSockets for real-time communication.

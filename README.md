# Business AI Chat Platform

A platform where users can register, manage their business profile, and chat with an AI chatbot that gives business-aware responses.

## Structure

- `backend/`: FastAPI backend
- `frontend/`: React + Vite frontend

## Getting Started

See `backend/README.md` and `frontend/README.md` for specific instructions.

## How to Start the Project

### Prerequisites
- Python 3.8+ (for backend)
- Node.js 16+ and npm (for frontend)
- PostgreSQL database (or configure your database connection)

### Starting the Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables (create a `.env` file in the `backend/` directory with required API keys)

4. Run the FastAPI server:
   ```bash
   python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

The backend will be available at `http://localhost:8000`

### Starting the Frontend

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173` (or the port shown in your terminal)

## How to Stop the Project

### Stopping the Backend
- Press `Ctrl + C` in the terminal running the FastAPI server

### Stopping the Frontend
- Press `Ctrl + C` in the terminal running the development server

### Full Shutdown
- Stop both terminals as described above
- All services will be gracefully terminated

## Deployment Guide

### Quick Overview
- **Backend**: Deploy to [Render](https://render.com/) (Python/FastAPI)
- **Frontend**: Deploy to [Vercel](https://vercel.com/) (React/Vite)

For detailed step-by-step instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

### Key Deployment Steps:
1. Push your code to GitHub
2. Deploy backend to Render with your API keys and database URL
3. Deploy frontend to Vercel with backend URL environment variable
4. Automatic redeployment on GitHub push

## Environment Variables
- LOGIN_TIMEOUT_MS: Client-side timeout (default: 20000)
- MAX_RETRIES: Max automatic login retries (default: 3)

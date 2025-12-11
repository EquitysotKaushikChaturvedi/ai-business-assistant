# Business AI Chat Platform - Troubleshooting Guide

This document details common issues encountered during the development and deployment of the Business AI Chat Platform and their solutions.

## 1. Vercel Deployment Failed ("Permission Denied")
**Issue:**  
The Vercel build failed with `Error: Command "npm run build" exited with 126` and `sh: line 1: .../vite: Permission denied`.

**Cause:**  
The `node_modules` directory was accidentally committed to the Git repository from a Windows environment. This caused file permission mismatches when Vercel (running on Linux) tried to execute binaries like `vite`.

**Solution:**  
- Created a `.gitignore` file to exclude `node_modules/`, `dist/`, `.env`, and other build artifacts.
- Removed `node_modules` from Git tracking using `git rm -r --cached frontend/node_modules`.
- Pushed clean changes to GitHub. Vercel then installed fresh dependencies with correct permissions.

## 2. API Key Security (Gemini API)
**Issue:**  
Need to securely use the Google Gemini API key without exposing it in the public code repository.

**Solution:**  
- **Local Development:** Created a `.env` file in the `backend/` directory containing `GEMINI_API_KEY=...`.
- **Production (Render):** Did NOT commit `.env`. Instead, added the `GEMINI_API_KEY` environment variable directly in the Render Dashboard (Environment settings).
- **Code:** The backend uses `os.getenv("GEMINI_API_KEY")` to safely read the key in both environments.

## 3. Login Failure ("Incorrect email or password")
**Issue:**  
After deployment, logging in with the default credentials (`admin@example.com`) failed, even though they worked locally.

**Cause:**  
1. **Empty Database:** The production database on Render starts empty. The local SQLite database is not uploaded.
2. **Password Mismatch:** Even after running the seed script initially, subsequent attempts failed because the script didn't update the password if the user already existed (preventing correction of bad data).
3. **Missing Dependency:** The logs showed `argon2: no backends available`, causing password verification to crash.

**Solution:**  
- **Seed Script:** Updated `backend/seed.py` to *force reset* the admin password to `Admin@123` every time it runs, ensuring a known good state.
- **Start Command:** Updated Render Start Command to `python seed.py && uvicorn app.main:app ...` so the database is populated automatically on every deploy.
- **Dependencies:** Added `argon2-cffi` to `backend/requirements.txt` to fix the hashing error.

## 4. Chat "Disconnected" Error (WebSocket 1006)
**Issue:**  
Users could log in but saw a "Disconnected" red badge when trying to chat. Browser console showed WebSocket connection failed (Error 1006).

**Cause:**  
1. **Frontend URL:** The frontend `Chat.jsx` was hardcoded to connect to `ws://localhost:8000`, which doesn't work in production.
2. **Missing Dependency:** The backend crashes when accepting WebSocket connections because `websockets` was missing from `requirements.txt` (FastAPI/Uvicorn needs it).

**Solution:**  
- **Frontend:** Updated `Chat.jsx` to dynamically calculate the WebSocket URL based on the current API URL, switching to `wss://` (Secure WebSocket) for production.
- **Backend:** Added `websockets` to `backend/requirements.txt`.

## 5. Vercel 404 on Refresh
**Issue:**  
Refreshing a page like `/dashboard` or `/chat` resulted in a 404 error from Vercel.

**Cause:**  
Single Page Applications (SPAs) like React need all routes to be handled by `index.html`. Vercel doesn't know this by default.

**Solution:**  
- Created `frontend/vercel.json` with a rewrite rule causing all traffic to serve `index.html`, allowing React Router to handle the navigation.

# Deployment Guide

This guide will help you upload your project to GitHub and deploy the backend to Render and the frontend to Vercel.

## 1. Upload to GitHub

1.  Initialize git (if not already done):
    ```bash
    git init
    ```
2.  Add files:
    ```bash
    git add .
    ```
3.  Commit changes:
    ```bash
    git commit -m "Initial commit"
    ```
4.  Create a new repository on [GitHub](https://github.com/new).
5.  Link your local repo to GitHub (replace `<YOUR_USERNAME>` and `<REPO_NAME>`):
    ```bash
    git remote add origin https://github.com/<YOUR_USERNAME>/<REPO_NAME>.git
    ```
6.  Push to GitHub:
    ```bash
    git branch -M main
    git push -u origin main
    ```

## 2. Deploy Backend to Render

1.  Sign up/Login to [Render](https://render.com/).
2.  Click **"New +"** and select **"Web Service"**.
3.  Connect your GitHub repository.
4.  Select the **backend** folder (or root if you restructure, but typically you deploy from root). Since your backend is in a generic subfolder, you might need to set the **Root Directory** to `backend` in Render settings.
5.  **Settings**:
    *   **Name**: `business-ai-chat-backend` (or similar)
    *   **Environment**: `Python 3`
    *   **Root Directory**: `backend`
    *   **Build Command**: `pip install -r requirements.txt`
    *   **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6.  **Environment Variables** (Add these in the "Environment" tab):
    *   `DATABASE_URL`: Your production database URL (Render provides PostgreSQL databases too).
    *   `SECRET_KEY`: A secret string for security.
    *   `OPENAI_API_KEY`: Your OpenAI key.
    *   Any other env vars from your `.env` file.
7.  Click **Create Web Service**.

## 3. Deploy Frontend to Vercel

1.  Sign up/Login to [Vercel](https://vercel.com/).
2.  Click **"Add New..."** -> **"Project"**.
3.  Import your GitHub repository.
4.  **Configure Project**:
    *   **Framework Preset**: `Vite`
    *   **Root Directory**: Click "Edit" and select `frontend`.
5.  **Environment Variables**:
    *   `VITE_API_URL`: The URL of your deployed backend (e.g., `https://business-ai-chat-backend.onrender.com`).
6.  Click **Deploy**.

## 4. Updates

When you push new code to GitHub, Render and Vercel will automatically redeploy.

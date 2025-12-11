from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import auth_router, business_router, chat_router

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Business AI Chat")

# CORS
origins = [
    "http://localhost:5173",  # Vite default
    "http://localhost:5174",  # Vite fallback port
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://127.0.0.1:3000",
    "*", # Allow all origins for production (Restrict this in real production!)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth_router.router)
app.include_router(business_router.router)
app.include_router(chat_router.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Business AI Chat API"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

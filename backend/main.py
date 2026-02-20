from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.assessment import router as assessment_router
import os
import sys

app = FastAPI(
    title="Psychotechnological Relationship Support API",
    description="An evidence-based mental health and relationship support platform",
    version="1.0.0"
)

# Configure CORS based on environment
env = os.getenv("ENV", "development").lower()

if env == "production":
    # In production, allow all origins for flexibility (Render + Vercel)
    allowed_origins = ["*"]
else:
    # In development, allow specific localhost and known Vercel origins
    allowed_origins = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "https://mental-health-app-63u5.vercel.app",
        "https://mental-health-app-swart.vercel.app",
        "https://mental-health-app-c53q.vercel.app",
    ]
    
    # Add custom origins from environment (FRONTEND_URL on Render)
    custom_origin = os.getenv("FRONTEND_URL")
    if custom_origin and custom_origin not in allowed_origins:
        allowed_origins.append(custom_origin)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(assessment_router)


@app.get("/")
async def root():
    return {
        "status": "alive",
        "message": "Relationship Support API — your wellbeing journey starts here"
    }


@app.get("/health")
async def health():
    return {"status": "healthy"}

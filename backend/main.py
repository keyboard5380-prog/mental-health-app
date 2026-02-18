from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.assessment import router as assessment_router

app = FastAPI(
    title="Psychotechnological Relationship Support API",
    description="An evidence-based mental health and relationship support platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
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

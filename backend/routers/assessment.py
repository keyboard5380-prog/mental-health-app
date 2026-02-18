from fastapi import APIRouter, HTTPException
from schemas.assessment import (
    AssessmentSubmission, AnalysisResult, Question, QuestionCategory
)
from services.question_bank import get_all_questions, get_questions_by_category
from services.analyzer import generate_analysis
from typing import List, Optional

router = APIRouter(prefix="/api/assessment", tags=["assessment"])


@router.get("/questions", response_model=List[Question])
async def get_questions(category: Optional[QuestionCategory] = None):
    if category:
        return get_questions_by_category(category)
    return get_all_questions()


@router.get("/questions/structured")
async def get_structured_questions():
    all_questions = get_all_questions()
    sections = [
        {
            "id": "attachment",
            "title": "Attachment & Connection",
            "subtitle": "Understanding your relational blueprint",
            "icon": "Heart",
            "color": "#C9A96E",
            "questions": [q.model_dump() for q in all_questions if q.id.startswith("att_")]
        },
        {
            "id": "gottman",
            "title": "Communication Dynamics",
            "subtitle": "Mapping the patterns in your conversations",
            "icon": "MessageCircle",
            "color": "#7BA7A7",
            "questions": [q.model_dump() for q in all_questions if q.id.startswith("gott_")]
        },
        {
            "id": "trauma",
            "title": "Trauma Awareness",
            "subtitle": "Gently exploring your history",
            "icon": "Shield",
            "color": "#A8B89C",
            "questions": [q.model_dump() for q in all_questions if q.id.startswith("trauma_")]
        },
        {
            "id": "phq_ads",
            "title": "Emotional Wellbeing",
            "subtitle": "Your mental health in the past two weeks",
            "icon": "Sun",
            "color": "#D4A5A5",
            "questions": [q.model_dump() for q in all_questions if q.id.startswith("phq_")]
        },
        {
            "id": "das",
            "title": "Relationship Satisfaction",
            "subtitle": "How your relationship is working day-to-day",
            "icon": "Users",
            "color": "#9B8EC4",
            "questions": [q.model_dump() for q in all_questions if q.id.startswith("das_")]
        },
        {
            "id": "ram",
            "title": "Safety & Stability",
            "subtitle": "Ensuring your wellbeing is protected",
            "icon": "Home",
            "color": "#7BA77B",
            "questions": [q.model_dump() for q in all_questions if q.id.startswith("ram_")]
        },
    ]
    return {
        "sections": sections,
        "total_questions": len(all_questions)
    }


@router.post("/submit", response_model=AnalysisResult)
async def submit_assessment(submission: AssessmentSubmission):
    if not submission.answers:
        raise HTTPException(status_code=400, detail="No answers provided")
    if len(submission.answers) < 10:
        raise HTTPException(
            status_code=400,
            detail=f"Insufficient answers: received {len(submission.answers)}, minimum 10 required"
        )
    return generate_analysis(submission.answers)


@router.get("/health")
async def assessment_health():
    questions = get_all_questions()
    return {
        "status": "healthy",
        "total_questions": len(questions),
        "categories": list({str(q.category) for q in questions})
    }

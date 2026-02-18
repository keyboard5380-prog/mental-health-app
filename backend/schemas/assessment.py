from pydantic import BaseModel
from typing import List, Optional
from enum import Enum


class QuestionType(str, Enum):
    likert = "likert"
    multiple_choice = "multiple_choice"
    yes_no = "yes_no"
    slider = "slider"


class QuestionCategory(str, Enum):
    attachment = "attachment"
    gottman = "gottman"
    trauma = "trauma"
    phq_ads = "phq_ads"
    das = "das"
    ram = "ram"


class Option(BaseModel):
    value: int
    label: str


class Question(BaseModel):
    id: str
    category: QuestionCategory
    text: str
    sub_text: Optional[str] = None
    type: QuestionType
    options: List[Option]
    weight: float = 1.0
    reverse_scored: bool = False


class AnswerSubmission(BaseModel):
    question_id: str
    value: int


class AssessmentSubmission(BaseModel):
    answers: List[AnswerSubmission]
    session_id: Optional[str] = None


class AttachmentProfile(BaseModel):
    style: str
    secure_score: float
    anxious_score: float
    avoidant_score: float
    disorganized_score: float
    description: str
    strengths: List[str]
    growth_areas: List[str]


class GottmanAnalysis(BaseModel):
    overall_health: float
    criticism_score: float
    defensiveness_score: float
    contempt_score: float
    stonewalling_score: float
    positive_ratio: float
    horsemen_present: List[str]
    relationship_trajectory: str
    description: str


class TraumaProfile(BaseModel):
    risk_level: str
    childhood_trauma_indicators: float
    ipt_indicators: float
    ptsd_indicators: float
    description: str
    recommendations: List[str]


class PHQADSResult(BaseModel):
    total_score: float
    phq9_score: float
    gad7_score: float
    severity: str
    clinical_recommendation: str
    description: str


class DASResult(BaseModel):
    total_score: float
    consensus_score: float
    satisfaction_score: float
    cohesion_score: float
    affection_score: float
    adaptation_level: str
    description: str


class RAMResult(BaseModel):
    risk_level: str
    color_code: str
    triage_criteria: str
    application_response: str
    urgent_concerns: List[str]


class SteppedCareRecommendation(BaseModel):
    step_level: int
    step_name: str
    description: str
    interventions: List[str]
    estimated_duration: str


class AnalysisResult(BaseModel):
    session_id: str
    overall_wellbeing_score: float
    attachment_profile: AttachmentProfile
    gottman_analysis: GottmanAnalysis
    trauma_profile: TraumaProfile
    phq_ads_result: PHQADSResult
    das_result: DASResult
    ram_result: RAMResult
    stepped_care: SteppedCareRecommendation
    daily_checkin_plan: List[str]
    summary: str
    positive_highlights: List[str]
    priority_focus_areas: List[str]

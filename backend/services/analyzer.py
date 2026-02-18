import uuid
from typing import List, Dict
from schemas.assessment import (
    AnswerSubmission, AnalysisResult, AttachmentProfile, GottmanAnalysis,
    TraumaProfile, PHQADSResult, DASResult, RAMResult, SteppedCareRecommendation,
    Question
)
from services.question_bank import get_all_questions


def normalize(value: float, min_val: float, max_val: float) -> float:
    if max_val == min_val:
        return 0.5
    return max(0.0, min(1.0, (value - min_val) / (max_val - min_val)))


def compute_weighted_score(answers: Dict[str, int], questions: List[Question], category_ids: List[str]) -> float:
    total_weight = 0.0
    weighted_sum = 0.0
    for q in questions:
        if q.id not in category_ids or q.id not in answers:
            continue
        max_option = max(opt.value for opt in q.options)
        min_option = min(opt.value for opt in q.options)
        raw = answers[q.id]
        if q.reverse_scored:
            raw = max_option - raw + min_option
        normalized = normalize(raw, min_option, max_option)
        weighted_sum += normalized * q.weight
        total_weight += q.weight
    if total_weight == 0:
        return 0.5
    return weighted_sum / total_weight


def analyze_attachment(answers: Dict[str, int], questions: List[Question]) -> AttachmentProfile:
    att_questions = [q for q in questions if q.id.startswith("att_")]
    att_ids = [q.id for q in att_questions]
    base_score = compute_weighted_score(answers, questions, att_ids)

    q01 = answers.get("att_01", 2)
    q02 = answers.get("att_02", 2)
    q03 = answers.get("att_03", 2)
    q04 = answers.get("att_04", 2)
    q07 = answers.get("att_07", 2)

    anxious_score = max(0.0, 1.0 - normalize(q01 + q04, 0, 8)) * 0.4 + (1.0 - normalize(q02, 0, 4)) * 0.6
    avoidant_score = normalize(q03, 0, 4) if q03 == 4 else (1.0 - normalize(q03, 0, 4)) * 0.3
    disorganized_score = 1.0 - normalize(q07, 0, 4)
    secure_score = base_score

    anxious_score = round(anxious_score * 100, 1)
    avoidant_score = round(avoidant_score * 100, 1)
    disorganized_score = round(disorganized_score * 100, 1)
    secure_score = round(secure_score * 100, 1)

    scores = {
        "Secure": secure_score,
        "Anxious": anxious_score,
        "Avoidant": avoidant_score,
        "Disorganized": disorganized_score
    }
    dominant_style = max(scores, key=scores.get)

    style_data = {
        "Secure": {
            "description": "You demonstrate a secure attachment style, characterized by a healthy balance between intimacy and autonomy. You trust your partner and can both give and receive emotional support with relative ease.",
            "strengths": ["Consistent emotional availability", "Comfort with vulnerability", "Healthy conflict resolution", "Stable sense of self in relationships"],
            "growth_areas": ["Continue deepening emotional intimacy", "Support partners who may be less secure"]
        },
        "Anxious": {
            "description": "Your attachment pattern shows anxious tendencies, often rooted in a fear of abandonment. You may find yourself needing frequent reassurance and feeling unsettled by perceived distance from your partner.",
            "strengths": ["Deep capacity for emotional investment", "Attuned to relationship dynamics", "Strong desire for closeness"],
            "growth_areas": ["Building self-soothing strategies", "Trusting the relationship without constant reassurance", "Recognizing when space is not rejection"]
        },
        "Avoidant": {
            "description": "You tend toward an avoidant-dismissive attachment style, where emotional distance feels safer than vulnerability. While you value your independence, intimate moments may trigger discomfort.",
            "strengths": ["Strong self-reliance", "Emotional regulation under pressure", "Clarity in personal boundaries"],
            "growth_areas": ["Practicing emotional disclosure", "Tolerating closeness without withdrawing", "Recognizing your partner's need for connection"]
        },
        "Disorganized": {
            "description": "Your responses suggest a disorganized attachment pattern, where intimacy can simultaneously feel deeply desired and frightening. This often stems from early experiences where caregivers were both comforting and threatening.",
            "strengths": ["Deep empathy from complex experiences", "Awareness of emotional complexity"],
            "growth_areas": ["Working with a therapist on early relational wounds", "Creating safety rituals in the relationship", "Developing predictable emotional patterns"]
        }
    }

    return AttachmentProfile(
        style=dominant_style,
        secure_score=secure_score,
        anxious_score=anxious_score,
        avoidant_score=avoidant_score,
        disorganized_score=disorganized_score,
        description=style_data[dominant_style]["description"],
        strengths=style_data[dominant_style]["strengths"],
        growth_areas=style_data[dominant_style]["growth_areas"]
    )


def analyze_gottman(answers: Dict[str, int], questions: List[Question]) -> GottmanAnalysis:
    criticism = 1.0 - normalize(answers.get("gott_01", 2), 0, 4)
    defensiveness = 1.0 - normalize(answers.get("gott_02", 2), 0, 4)
    contempt = 1.0 - normalize(answers.get("gott_03", 2), 0, 4)
    stonewalling = 1.0 - normalize(answers.get("gott_04", 2), 0, 4)
    positive_ratio_raw = answers.get("gott_05", 2)
    repair = normalize(answers.get("gott_06", 2), 0, 4)
    shared_meaning = normalize(answers.get("gott_07", 2), 0, 4)

    horsemen_present = []
    if criticism > 0.6:
        horsemen_present.append("Criticism")
    if defensiveness > 0.6:
        horsemen_present.append("Defensiveness")
    if contempt > 0.6:
        horsemen_present.append("Contempt")
    if stonewalling > 0.6:
        horsemen_present.append("Stonewalling")

    positive_ratio = [0.5, 1.0, 2.0, 3.5, 6.0][positive_ratio_raw]
    overall_health = (
        (1.0 - criticism) * 0.2 +
        (1.0 - defensiveness) * 0.15 +
        (1.0 - contempt) * 0.25 +
        (1.0 - stonewalling) * 0.15 +
        normalize(positive_ratio_raw, 0, 4) * 0.15 +
        repair * 0.05 +
        shared_meaning * 0.05
    ) * 100

    if overall_health >= 75:
        trajectory = "Thriving"
    elif overall_health >= 55:
        trajectory = "Stable with areas of growth"
    elif overall_health >= 35:
        trajectory = "At risk — intervention recommended"
    else:
        trajectory = "High distress — support needed"

    return GottmanAnalysis(
        overall_health=round(overall_health, 1),
        criticism_score=round(criticism * 100, 1),
        defensiveness_score=round(defensiveness * 100, 1),
        contempt_score=round(contempt * 100, 1),
        stonewalling_score=round(stonewalling * 100, 1),
        positive_ratio=positive_ratio,
        horsemen_present=horsemen_present,
        relationship_trajectory=trajectory,
        description=f"Your relationship currently shows {len(horsemen_present)} of the Four Horsemen patterns. The positive interaction ratio is approximately {positive_ratio}:1 (Gottman's ideal is 5:1). Your relationship trajectory is: {trajectory}."
    )


def analyze_trauma(answers: Dict[str, int], questions: List[Question]) -> TraumaProfile:
    childhood = normalize(answers.get("trauma_01", 0), 0, 4)
    ipt = normalize(answers.get("trauma_02", 0), 0, 4)
    hypervigilance = normalize(answers.get("trauma_03", 0), 0, 4)
    numbing = normalize(answers.get("trauma_04", 0), 0, 4)
    pattern_awareness = normalize(answers.get("trauma_05", 0), 0, 4)

    ptsd_indicators = (hypervigilance + numbing) / 2
    composite_risk = (childhood * 0.25 + ipt * 0.35 + ptsd_indicators * 0.3 + pattern_awareness * 0.1)

    if composite_risk < 0.2:
        risk_level = "Low"
        recommendations = [
            "Maintain current healthy relationship habits",
            "Continue building emotional safety with your partner",
            "Regular 3-minute daily check-ins to sustain connection"
        ]
    elif composite_risk < 0.45:
        risk_level = "Moderate"
        recommendations = [
            "Consider journaling your emotional patterns",
            "Begin working with a therapist to explore attachment history",
            "Practice grounding exercises during relational stress",
            "Share your insights from this assessment with a trusted partner or counselor"
        ]
    elif composite_risk < 0.7:
        risk_level = "Elevated"
        recommendations = [
            "Strongly recommend engaging with a trauma-informed therapist",
            "Explore EMDR or somatic therapies for relational trauma",
            "Create a safety plan with your therapist or counselor",
            "Consider couples therapy to address trauma's impact on the relationship"
        ]
    else:
        risk_level = "High"
        recommendations = [
            "Please reach out to a mental health professional as soon as possible",
            "If you are in immediate danger, contact emergency services or a crisis line",
            "Connect with a trauma specialist — this is a priority",
            "Consider reaching out to the National DV Hotline: 1-800-799-7233"
        ]

    return TraumaProfile(
        risk_level=risk_level,
        childhood_trauma_indicators=round(childhood * 100, 1),
        ipt_indicators=round(ipt * 100, 1),
        ptsd_indicators=round(ptsd_indicators * 100, 1),
        description=f"Your trauma profile indicates a {risk_level.lower()} risk level. Early experiences and interpersonal trauma history both contribute to how we relate to partners. Understanding these patterns is the first step toward healing.",
        recommendations=recommendations
    )


def analyze_phq_ads(answers: Dict[str, int]) -> PHQADSResult:
    phq9_items = ["phq_01", "phq_02", "phq_03"]
    gad7_items = ["phq_04", "phq_05", "phq_06"]

    phq9_score = sum(answers.get(k, 0) for k in phq9_items)
    gad7_score = sum(answers.get(k, 0) for k in gad7_items)
    total = phq9_score + gad7_score

    total_normalized = total / 18.0 * 48

    if total_normalized <= 9:
        severity = "Minimal"
        recommendation = "Continue with preventative education and self-care practices."
    elif total_normalized <= 19:
        severity = "Mild"
        recommendation = "Low-intensity digital interventions and psychoeducation are recommended."
    elif total_normalized <= 29:
        severity = "Moderate"
        recommendation = "Tele-coaching and a clinician check-in are strongly recommended."
    else:
        severity = "Severe"
        recommendation = "Immediate specialist referral is recommended. Please reach out to a mental health professional."

    return PHQADSResult(
        total_score=round(total_normalized, 1),
        phq9_score=float(phq9_score),
        gad7_score=float(gad7_score),
        severity=severity,
        clinical_recommendation=recommendation,
        description=f"Your combined anxiety and depression score falls in the {severity.lower()} range. These feelings are real, and there is support available for every level of distress."
    )


def analyze_das(answers: Dict[str, int]) -> DASResult:
    consensus = normalize(answers.get("das_01", 2), 0, 4) * 100
    satisfaction = normalize(answers.get("das_02", 2), 0, 4) * 100
    cohesion = normalize(answers.get("das_03", 2), 0, 4) * 100
    affection = normalize(answers.get("das_04", 2), 0, 4) * 100
    openness = normalize(answers.get("das_05", 2), 0, 4) * 100

    total = (consensus * 0.25 + satisfaction * 0.30 + cohesion * 0.20 + affection * 0.15 + openness * 0.10)

    if total >= 75:
        adaptation = "High Adaptation"
    elif total >= 55:
        adaptation = "Moderate Adaptation"
    elif total >= 35:
        adaptation = "Low Adaptation"
    else:
        adaptation = "Significant Dyadic Distress"

    return DASResult(
        total_score=round(total, 1),
        consensus_score=round(consensus, 1),
        satisfaction_score=round(satisfaction, 1),
        cohesion_score=round(cohesion, 1),
        affection_score=round(affection, 1),
        adaptation_level=adaptation,
        description=f"Your Dyadic Adjustment score indicates {adaptation.lower()}. This reflects areas of both strength and opportunity within your relationship dynamic."
    )


def analyze_ram(answers: Dict[str, int]) -> RAMResult:
    physical_safety = answers.get("ram_01", 0)
    psychological_safety = answers.get("ram_02", 4)
    hopelessness = answers.get("ram_03", 0)
    self_harm = answers.get("phq_06", 0)

    urgent_concerns = []
    if physical_safety >= 2:
        urgent_concerns.append("Physical safety concern identified")
    if psychological_safety <= 1:
        urgent_concerns.append("Psychological coercion or control detected")
    if self_harm >= 2:
        urgent_concerns.append("Self-harm ideation present — immediate support recommended")
    if hopelessness >= 2:
        urgent_concerns.append("Persistent hopelessness — clinical attention needed")

    risk_score = (physical_safety / 3.0) * 0.40 + (1.0 - psychological_safety / 4.0) * 0.35 + (hopelessness / 3.0) * 0.15 + (self_harm / 3.0) * 0.10

    if risk_score >= 0.5 or physical_safety >= 2 or self_harm >= 2:
        return RAMResult(
            risk_level="High",
            color_code="red",
            triage_criteria="Immediate risk of self-harm or interpersonal violence",
            application_response="Connecting you to emergency resources and crisis support lines",
            urgent_concerns=urgent_concerns
        )
    elif risk_score >= 0.25 or len(urgent_concerns) >= 1:
        return RAMResult(
            risk_level="Medium",
            color_code="amber",
            triage_criteria="Significant distress with history of trauma or relational harm",
            application_response="Tele-coaching referral and specialist consultation recommended",
            urgent_concerns=urgent_concerns
        )
    else:
        return RAMResult(
            risk_level="Low",
            color_code="green",
            triage_criteria="Stable emotional state with manageable relational friction",
            application_response="Self-guided modules and regular check-in prompts",
            urgent_concerns=[]
        )


def determine_stepped_care(ram: RAMResult, phq: PHQADSResult, das: DASResult) -> SteppedCareRecommendation:
    if ram.risk_level == "High" or phq.severity == "Severe":
        return SteppedCareRecommendation(
            step_level=4,
            step_name="Specialist Referral",
            description="Your current needs require the support of a qualified mental health specialist. This is a sign of strength, not weakness.",
            interventions=["Psychiatric evaluation", "Trauma-informed therapy", "Crisis counseling", "Safety planning"],
            estimated_duration="Ongoing — typically 3–6 months minimum"
        )
    elif phq.severity == "Moderate" or das.adaptation_level == "Significant Dyadic Distress":
        return SteppedCareRecommendation(
            step_level=3,
            step_name="Video Therapy Sessions",
            description="High-intensity face-to-face digital sessions with a licensed therapist are recommended to address the current level of distress.",
            interventions=["Weekly video therapy", "Couples counseling", "Structured CBT modules", "Relationship skill-building"],
            estimated_duration="8–16 weeks"
        )
    elif phq.severity == "Mild" or das.adaptation_level == "Low Adaptation":
        return SteppedCareRecommendation(
            step_level=2,
            step_name="Tele-Coaching with Phone Calls",
            description="Scheduled synchronous calls with a care provider will help you navigate current challenges with personalized guidance.",
            interventions=["Bi-weekly coaching calls", "Guided journaling", "Attachment-informed exercises", "Daily check-in modules"],
            estimated_duration="4–8 weeks"
        )
    elif phq.severity == "Minimal" and das.adaptation_level in ["Moderate Adaptation", "High Adaptation"]:
        return SteppedCareRecommendation(
            step_level=1,
            step_name="i-CBT with Asynchronous Messaging",
            description="Self-guided internet-based CBT modules enhanced by asynchronous check-in messages from a care provider.",
            interventions=["Weekly psychoeducation modules", "Gottman repair exercises", "Daily 3-minute check-ins", "Mindfulness practices"],
            estimated_duration="4–6 weeks"
        )
    else:
        return SteppedCareRecommendation(
            step_level=0,
            step_name="Preventative i-CBT",
            description="You are in a good place. Preventative digital tools will help you maintain and grow the wellbeing you have built.",
            interventions=["Relationship enrichment modules", "Communication skill-builders", "Monthly self-assessments", "Gratitude and appreciation practices"],
            estimated_duration="Ongoing maintenance"
        )


def generate_analysis(submissions: List[AnswerSubmission]) -> AnalysisResult:
    answers = {sub.question_id: sub.value for sub in submissions}
    questions = get_all_questions()

    attachment = analyze_attachment(answers, questions)
    gottman = analyze_gottman(answers, questions)
    trauma = analyze_trauma(answers, questions)
    phq_ads = analyze_phq_ads(answers)
    das = analyze_das(answers)
    ram = analyze_ram(answers)
    stepped_care = determine_stepped_care(ram, phq_ads, das)

    overall = (
        attachment.secure_score * 0.25 +
        gottman.overall_health * 0.30 +
        (100 - trauma.ipt_indicators) * 0.10 +
        (100 - phq_ads.total_score / 48 * 100) * 0.20 +
        das.total_score * 0.15
    )
    overall = round(max(0, min(100, overall)), 1)

    positive_highlights = []
    if attachment.secure_score > 60:
        positive_highlights.append("Strong foundation of secure attachment tendencies")
    if gottman.positive_ratio >= 3:
        positive_highlights.append(f"Positive interaction ratio of {gottman.positive_ratio}:1 — on track toward Gottman's ideal")
    if das.satisfaction_score > 65:
        positive_highlights.append("Above-average relationship satisfaction")
    if das.cohesion_score > 65:
        positive_highlights.append("Strong sense of shared activities and cohesion")
    if not positive_highlights:
        positive_highlights.append("Courage in completing this self-assessment is itself a strength")
        positive_highlights.append("Awareness of relational patterns opens the door to meaningful change")

    priority_focus = []
    if gottman.horsemen_present:
        priority_focus.append(f"Address {', '.join(gottman.horsemen_present)} patterns in communication")
    if trauma.risk_level in ["Elevated", "High"]:
        priority_focus.append("Engage with trauma-informed therapeutic support")
    if attachment.style in ["Anxious", "Disorganized"]:
        priority_focus.append("Build self-soothing and emotional regulation practices")
    if das.total_score < 50:
        priority_focus.append("Invest in dyadic cohesion through shared meaningful experiences")
    if not priority_focus:
        priority_focus.append("Continue maintaining the healthy patterns you've built")

    daily_checkin = [
        "🌅 Morning: Share one thing you're looking forward to today",
        "☀️ Midday: Send a brief appreciation text to your partner",
        "🌙 Evening: 3-minute check-in — One Win, One Challenge, Two Appreciations",
        "🌟 Weekly: Schedule one intentional 'date' activity together",
        "💭 Monthly: Revisit this assessment to track your progress"
    ]

    return AnalysisResult(
        session_id=str(uuid.uuid4()),
        overall_wellbeing_score=overall,
        attachment_profile=attachment,
        gottman_analysis=gottman,
        trauma_profile=trauma,
        phq_ads_result=phq_ads,
        das_result=das,
        ram_result=ram,
        stepped_care=stepped_care,
        daily_checkin_plan=daily_checkin,
        summary=f"Your overall relational wellbeing score is {overall}/100. This assessment reflects patterns across attachment security, relationship dynamics, emotional health, and trauma history. Every insight here is an invitation, not a verdict.",
        positive_highlights=positive_highlights,
        priority_focus_areas=priority_focus
    )

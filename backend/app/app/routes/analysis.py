from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from sqlalchemy.orm import Session
from datetime import datetime
import json
from app.database import get_db
from app.dependencies import get_current_user
from app.models.resume import Resume
from app.models.analysis import Analysis
from app.services.ai_service import analyze_resume
from app.schemas.analysis import AnalysisOut

router = APIRouter(tags=["Analysis"])

@router.post("/analyze/{resume_id}", response_model=AnalysisOut)
def analyze(resume_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    if not resume.extracted_text:
        raise HTTPException(status_code=400, detail="Could not read text from this resume PDF")

    if current_user.plan != "premium":
        today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
        count_today = (
            db.query(Analysis)
            .join(Resume, Analysis.resume_id == Resume.id)
            .filter(Resume.user_id == current_user.id, Analysis.created_at >= today_start)
            .count()
        )
        if count_today >= 1:
            raise HTTPException(
                status_code=403,
                detail="Free plan allows only 1 analysis per day. Upgrade to Premium for unlimited analysis.",
            )

    result = analyze_resume(resume.extracted_text)

    analysis = Analysis(
        resume_id=resume.id,
        score=result.get("resume_score", 0),
        ats_score=result.get("ats_score", 0),
        feedback=json.dumps(result),
    )
    db.add(analysis)
    db.commit()
    db.refresh(analysis)
    return analysis

@router.get("/analysis/{resume_id}", response_model=AnalysisOut)
def get_analysis(resume_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    analysis = (
        db.query(Analysis)
        .filter(Analysis.resume_id == resume_id)
        .order_by(Analysis.created_at.desc())
        .first()
    )
    if not analysis:
        raise HTTPException(status_code=404, detail="No analysis found for this resume")
    return analysis

@router.get("/analysis/{resume_id}/download")
def download_report(resume_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    if current_user.plan != "premium":
        raise HTTPException(status_code=403, detail="Downloading reports is a Premium feature. Please upgrade.")

    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    analysis = (
        db.query(Analysis)
        .filter(Analysis.resume_id == resume_id)
        .order_by(Analysis.created_at.desc())
        .first()
    )
    if not analysis:
        raise HTTPException(status_code=404, detail="No analysis found for this resume")

    feedback = json.loads(analysis.feedback)

    lines = [
        "AI RESUME ANALYZER PRO - ANALYSIS REPORT",
        "=" * 50,
        f"Resume: {resume.original_filename or resume.filename}",
        f"Analyzed on: {analysis.created_at}",
        "",
        f"Resume Score: {feedback.get('resume_score')}/100",
        f"ATS Score: {feedback.get('ats_score')}/100",
        "",
        "SKILLS FOUND:",
        *[f"- {s}" for s in feedback.get("skills", [])],
        "",
        "MISSING SKILLS:",
        *[f"- {s}" for s in feedback.get("missing_skills", [])],
        "",
        "GRAMMAR ISSUES:",
        *[f"- {s}" for s in feedback.get("grammar_issues", [])],
        "",
        "PROJECTS FEEDBACK:",
        feedback.get("projects_feedback", ""),
        "",
        "EXPERIENCE FEEDBACK:",
        feedback.get("experience_feedback", ""),
        "",
        "SUGGESTIONS:",
        *[f"- {s}" for s in feedback.get("suggestions", [])],
    ]
    report_text = "\n".join(lines)

    return Response(
        content=report_text,
        media_type="text/plain",
        headers={"Content-Disposition": f"attachment; filename=resume_analysis_report_{resume_id}.txt"},
    )

from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.dependencies import get_current_user
from app.services import resume_service
from app.models.resume import Resume
from app.models.analysis import Analysis
from app.schemas.resume import ResumeOut

router = APIRouter(tags=["Resume"])

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

@router.post("/upload", response_model=ResumeOut)
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File size must be under 5MB")

    saved_filename, file_path = resume_service.save_pdf(contents, file.filename, current_user.id)
    extracted_text = resume_service.extract_text(file_path)

    resume = Resume(
        user_id=current_user.id,
        filename=saved_filename,
        original_filename=file.filename,
        extracted_text=extracted_text,
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)
    return resume

@router.get("/history", response_model=List[ResumeOut])
def get_history(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    resumes = (
        db.query(Resume)
        .filter(Resume.user_id == current_user.id)
        .order_by(Resume.uploaded_at.desc())
        .all()
    )

    results = []
    for r in resumes:
        latest = (
            db.query(Analysis)
            .filter(Analysis.resume_id == r.id)
            .order_by(Analysis.created_at.desc())
            .first()
        )
        results.append(ResumeOut(
            id=r.id,
            filename=r.filename,
            original_filename=r.original_filename,
            uploaded_at=r.uploaded_at,
            score=latest.score if latest else None,
            ats_score=latest.ats_score if latest else None,
            analyzed_at=latest.created_at if latest else None,
        ))
    return results

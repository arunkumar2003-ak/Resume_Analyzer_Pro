from sqlalchemy import Column, Integer, Text, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.database import Base

class Analysis(Base):
    __tablename__ = "analysis"

    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, ForeignKey("resumes.id"), nullable=False)
    score = Column(Integer, nullable=True)
    ats_score = Column(Integer, nullable=True)
    feedback = Column(Text, nullable=True)  # full JSON result stored as text
    created_at = Column(DateTime(timezone=True), server_default=func.now())

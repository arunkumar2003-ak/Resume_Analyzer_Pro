from pydantic import BaseModel
from datetime import datetime

class AnalysisOut(BaseModel):
    id: int
    resume_id: int
    score: int
    ats_score: int
    feedback: str
    created_at: datetime

    class Config:
        from_attributes = True

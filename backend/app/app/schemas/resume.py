from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ResumeOut(BaseModel):
    id: int
    filename: str
    uploaded_at: datetime
    score: Optional[int] = None
    ats_score: Optional[int] = None
    analyzed_at: Optional[datetime] = None

    class Config:
        from_attributes = True

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import health, auth, resume, analysis, payment, admin
from app.database import Base, engine
from app.config import settings
from app.models import user, resume as resume_model, analysis as analysis_model, payment as payment_model  # noqa: F401

Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Resume Analyzer Pro API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(auth.router)
app.include_router(resume.router)
app.include_router(analysis.router)
app.include_router(payment.router)
app.include_router(admin.router)

@app.get("/")
def root():
    return {"message": "AI Resume Analyzer Pro API is running"}

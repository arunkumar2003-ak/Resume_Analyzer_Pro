import json
import google.generativeai as genai
from app.config import settings

genai.configure(api_key=settings.GEMINI_API_KEY)

PROMPT_TEMPLATE = """You are an expert resume reviewer and ATS (Applicant Tracking System) analyzer.
Analyze the following resume text and return ONLY a valid JSON object (no markdown, no code fences, no extra text) with this exact structure:

{{
  "resume_score": <integer 0-100>,
  "ats_score": <integer 0-100>,
  "skills": [<list of skills found in the resume>],
  "missing_skills": [<list of important skills missing for a strong resume in this field>],
  "grammar_issues": [<list of grammar or wording issues found, empty list if none>],
  "projects_feedback": "<short feedback on the projects section>",
  "experience_feedback": "<short feedback on the experience section>",
  "suggestions": [<list of concrete, actionable improvement suggestions>]
}}

Resume text:
\"\"\"
{resume_text}
\"\"\"
"""

def analyze_resume(resume_text: str) -> dict:
    model = genai.GenerativeModel("gemini-flash-latest")
    prompt = PROMPT_TEMPLATE.format(resume_text=resume_text[:12000])
    response = model.generate_content(prompt)
    raw_text = response.text.strip()

    if raw_text.startswith("```"):
        raw_text = raw_text.strip("`")
        if raw_text.lower().startswith("json"):
            raw_text = raw_text[4:]
        raw_text = raw_text.strip()

    try:
        data = json.loads(raw_text)
    except json.JSONDecodeError:
        data = {
            "resume_score": 0,
            "ats_score": 0,
            "skills": [],
            "missing_skills": [],
            "grammar_issues": [],
            "projects_feedback": "Could not analyze - AI response error.",
            "experience_feedback": "",
            "suggestions": ["Please try analyzing again."],
        }
    return data

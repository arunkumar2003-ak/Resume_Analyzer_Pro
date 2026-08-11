import os
import uuid
import fitz  # PyMuPDF

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def save_pdf(contents: bytes, original_filename: str, user_id: int):
    unique_name = f"user{user_id}_{uuid.uuid4().hex[:8]}.pdf"
    file_path = os.path.join(UPLOAD_DIR, unique_name)
    with open(file_path, "wb") as f:
        f.write(contents)
    return unique_name, file_path

def extract_text(file_path: str) -> str:
    text = ""
    try:
        doc = fitz.open(file_path)
        for page in doc:
            text += page.get_text()
        doc.close()
    except Exception:
        text = ""
    return text.strip()

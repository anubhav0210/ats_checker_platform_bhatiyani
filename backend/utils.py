# utils.py
# Utility helpers: PDF parsing, scoring, filename helpers
import os
import uuid
import fitz   # pymupdf
from dateutil import parser as dateparser

def save_upload_file(upload_file, dest_folder):
    """
    Save FastAPI UploadFile to dest_folder with unique filename.
    Returns path to saved file.
    """
    os.makedirs(dest_folder, exist_ok=True)
    ext = os.path.splitext(upload_file.filename)[1] or ".pdf"
    unique_name = f"{uuid.uuid4().hex}{ext}"
    path = os.path.join(dest_folder, unique_name)
    with open(path, "wb") as f:
        f.write(upload_file.file.read())
    upload_file.file.close()
    return path

def extract_text_from_pdf(path):
    """
    Extract text from a PDF using PyMuPDF (fitz).
    Returns concatenated text.
    """
    text_parts = []
    try:
        doc = fitz.open(path)
        for page in doc:
            text_parts.append(page.get_text())
        doc.close()
    except Exception as e:
        # If parsing fails, return empty string (caller should handle)
        return ""
    return "\n".join(text_parts)

def simple_keyword_score(parsed_text: str, job_description: str):
    """
    Very simple scoring:
    - tokenizes job_description to words (lowercase, unique)
    - counts matches in parsed_text
    - returns percentage and details
    """
    if not parsed_text or not job_description:
        return {"score": 0, "matched": 0, "total": 0, "matched_keywords": []}
    parsed_lower = parsed_text.lower()
    # naive tokenization: split on whitespace and non-alphanum
    import re
    keywords = re.findall(r"\b[a-zA-Z0-9+-]+\b", job_description.lower()) 
    keywords = list(dict.fromkeys(keywords))  # unique preserve order
    total = len(keywords)
    matched_keywords = [kw for kw in keywords if kw in parsed_lower]
    matched = len(matched_keywords)
    score = int((matched / total) * 100) if total > 0 else 0
    return {"score": score, "matched": matched, "total": total, "matched_keywords": matched_keywords}
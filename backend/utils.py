# utils.py
import os
import uuid

from pdfminer.high_level import extract_text
  # pymupdf

def save_upload_file(upload_file, dest_folder):
    os.makedirs(dest_folder, exist_ok=True)
    ext = os.path.splitext(upload_file.filename)[1] or ".pdf"
    unique_name = f"{uuid.uuid4().hex}{ext}"
    path = os.path.join(dest_folder, unique_name)
    # upload_file is a SpooledTemporaryFile-like object; read bytes
    with open(path, "wb") as f:
        f.write(upload_file.file.read())
    upload_file.file.close()
    return path, unique_name

def extract_text_from_pdf(path):
    try:
        return extract_text(path)
    except Exception:
        return ""

def simple_keyword_score(parsed_text: str, job_description: str):
    if not parsed_text or not job_description:
        return {"score": 0, "matched": 0, "total": 0, "matched_keywords": []}
    parsed_lower = parsed_text.lower()
    import re
    keywords = re.findall(r"\b[a-zA-Z0-9+-]+\b", job_description.lower())
    keywords = list(dict.fromkeys(keywords))
    total = len(keywords)
    matched_keywords = [kw for kw in keywords if kw in parsed_lower]
    matched = len(matched_keywords)
    score = int((matched / total) * 100) if total > 0 else 0
    return {"score": score, "matched": matched, "total": total, "matched_keywords": matched_keywords}
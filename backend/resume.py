# resume.py
# Handles resume upload, parsing, scoring and dashboard data retrieval

from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from fastapi.responses import JSONResponse
from typing import Optional
import os
from dotenv import load_dotenv
from utils import save_upload_file, extract_text_from_pdf, simple_keyword_score
from database import resumes_collection
from auth import get_current_user
from datetime import datetime

load_dotenv()
UPLOAD_DIR = os.environ.get("UPLOAD_DIR", "./uploads")

router = APIRouter(tags=["resume"])

@router.post("/resume/upload")
async def upload_resume(
    file: UploadFile = File(...),
    job_description: str = Form(...),
    current_user: dict = Depends(get_current_user)
):
    """
    Accepts a PDF file and a job_description string.
    - Saves the file to disk
    - Extracts text
    - Runs a simple keyword-based scoring
    - Saves metadata & result to MongoDB
    - Returns the score and parsed text (frontend expects {score, parsed_text})
    """
    if file.content_type not in ("application/pdf",):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    saved_path = save_upload_file(file, UPLOAD_DIR)
    parsed_text = extract_text_from_pdf(saved_path)

    scoring = simple_keyword_score(parsed_text, job_description)
    score = scoring["score"]

    # Save analysis record to DB (for dashboard)
    resume_doc = {
        "_id": os.urandom(12).hex(),
        "user_id": current_user["id"],
        "filename": os.path.basename(saved_path),
        "original_name": file.filename,
        "uploaded_at": datetime.utcnow().isoformat(),
        "score": score,
        "matched_keywords": scoring.get("matched_keywords", []),
        "job_description": job_description,
        "parsed_text": parsed_text[:20000]  # cap size to avoid huge docs
    }
    await resumes_collection.insert_one(resume_doc)

    return JSONResponse({"score": score, "parsed_text": parsed_text})

@router.get("/dashboard-data")
async def dashboard_data(current_user: dict = Depends(get_current_user)):
    """
    Returns recent resume analysis entries for the logged in user.
    Frontend's Dashboard will fetch this to show stats & charts.
    """
    cursor = resumes_collection.find({"user_id": current_user["id"]}).sort("uploaded_at", -1).limit(50)
    docs = await cursor.to_list(length=50)
    # Map to a simpler response structure
    results = [
        {
            "id": d["_id"],
            "uploaded_at": d.get("uploaded_at"),
            "score": d.get("score"),
            "original_name": d.get("original_name"),
            "matched_keywords": d.get("matched_keywords", [])
        } for d in docs
    ]
    # compute some summary metrics
    total = len(results)
    avg_score = int(sum(r["score"] for r in results) / total) if total > 0 else 0

    return {"total": total, "avg_score": avg_score, "history": results}

# resume.py
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from fastapi.responses import JSONResponse
from typing import Optional
import os
from dotenv import load_dotenv
from utils import save_upload_file, extract_text_from_pdf, simple_keyword_score
from database import resumes_collection
from auth import get_current_user
from datetime import datetime
from bson import ObjectId

load_dotenv()
UPLOAD_DIR = os.environ.get("UPLOAD_DIR", "./uploads")

router = APIRouter(prefix="/resume", tags=["resume"])

@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    job_description: str = Form(...),
    current_user: dict = Depends(get_current_user)
):
    if file.content_type not in ("application/pdf",):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    saved_path, filename = save_upload_file(file, UPLOAD_DIR)
    parsed_text = extract_text_from_pdf(saved_path)
    scoring = simple_keyword_score(parsed_text, job_description)
    score = scoring["score"]

    resume_doc = {
        "user_id": ObjectId(current_user["id"]),
        "filename": filename,
        "original_name": file.filename,
        "uploaded_at": datetime.utcnow().isoformat(),
        "score": score,
        "matched_keywords": scoring.get("matched_keywords", []),
        "job_description": job_description,
        "parsed_text": parsed_text[:20000]
    }
    result = await resumes_collection.insert_one(resume_doc)

    return JSONResponse({"score": score, "parsed_text": parsed_text})

@router.get("/all")
async def all_resumes(current_user: dict = Depends(get_current_user)):
    cursor = resumes_collection.find({"user_id": ObjectId(current_user["id"])}).sort("uploaded_at", -1).limit(50)
    docs = await cursor.to_list(length=50)
    # map shape expected by frontend Dashboard:
    results = [
        {
            "_id": str(d["_id"]),
            "filePath": f"uploads/{d['filename']}",
            "originalName": d.get("original_name"),
            "uploaded_at": d.get("uploaded_at"),
            "score": d.get("score"),
            "matched_keywords": d.get("matched_keywords", []),
        } for d in docs
    ]
    return results

@router.get("/{resume_id}")
async def get_resume(resume_id: str, current_user: dict = Depends(get_current_user)):
    try:
        oid = ObjectId(resume_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid id")
    doc = await resumes_collection.find_one({"_id": oid, "user_id": ObjectId(current_user["id"])})
    if not doc:
        raise HTTPException(status_code=404, detail="Not found")
    return {
        "id": str(doc["_id"]),
        "originalName": doc["original_name"],
        "filePath": f"uploads/{doc['filename']}",
        "score": doc.get("score"),
        "parsed_text": doc.get("parsed_text", "")
    }

# resume.py
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from fastapi.responses import JSONResponse
from fastapi import status
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
BACKEND_URL = os.environ.get("BACKEND_URL", "http://localhost:8000")

router = APIRouter(prefix="/api/resumes", tags=["resumes"])

# POST /api/resumes  -> upload new resume
@router.post("", status_code=status.HTTP_201_CREATED)
async def upload_resume(
    file: UploadFile = File(...),
    resume_name: str = Form(...),
    job_description: str = Form(""),
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
        "resume_name": resume_name,
        "filename": filename,
        "original_name": file.filename,
        "uploaded_at": datetime.utcnow().isoformat(),
        "score": score,
        "matched_keywords": scoring.get("matched_keywords", []),
        "job_description": job_description,
        "parsed_text": parsed_text[:20000]
    }
    result = await resumes_collection.insert_one(resume_doc)

    file_url = f"{BACKEND_URL}/uploads/{filename}"

    return JSONResponse({
        "id": str(result.inserted_id),
        "resume_name": resume_name,
        "score": score,
        "file_url": file_url,
        "parsed_text": parsed_text
    })

# GET /api/resumes  -> list all resumes for current user
@router.get("")
async def list_resumes(current_user: dict = Depends(get_current_user)):
    cursor = resumes_collection.find({"user_id": ObjectId(current_user["id"])}).sort("uploaded_at", -1).limit(200)
    docs = await cursor.to_list(length=200)
    results = [
        {
            "id": str(d["_id"]),
            "resume_name": d.get("resume_name"),
            "uploaded_at": d.get("uploaded_at"),
            "score": d.get("score"),
            "file_url": f"{BACKEND_URL}/uploads/{d['filename']}",
        } for d in docs
    ]
    return results

# GET /api/resumes/{id}
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
        "resume_name": doc.get("resume_name"),
        "original_name": doc.get("original_name"),
        "file_url": f"{BACKEND_URL}/uploads/{doc['filename']}",
        "score": doc.get("score"),
        "parsed_text": doc.get("parsed_text", ""),
        "matched_keywords": doc.get("matched_keywords", []),
        "uploaded_at": doc.get("uploaded_at")
    }

# DELETE /api/resumes/{id}
@router.delete("/{resume_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_resume(resume_id: str, current_user: dict = Depends(get_current_user)):
    try:
        oid = ObjectId(resume_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid id")
    doc = await resumes_collection.find_one({"_id": oid, "user_id": ObjectId(current_user["id"])})
    if not doc:
        raise HTTPException(status_code=404, detail="Not found")

    # remove file from disk if exists
    filename = doc.get("filename")
    if filename:
        path = os.path.join(UPLOAD_DIR, filename)
        try:
            if os.path.exists(path):
                os.remove(path)
        except Exception:
            pass

    await resumes_collection.delete_one({"_id": oid})
    return JSONResponse(status_code=status.HTTP_204_NO_CONTENT, content=None)

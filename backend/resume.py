# backend/resume.py
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException, status
from fastapi.responses import JSONResponse, StreamingResponse
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorGridFSBucket
from bson import ObjectId
from datetime import datetime
from dotenv import load_dotenv
import os
import mimetypes

from utils import extract_text_from_pdf, simple_keyword_score
from auth import get_current_user

load_dotenv()

BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "resume_db")

client = AsyncIOMotorClient(MONGO_URI)
db = client[DB_NAME]
resumes_collection = db["resumes"]

router = APIRouter(prefix="/api/resumes", tags=["resumes"])

# GridFS bucket helper (reused)
def get_gridfs():
    return AsyncIOMotorGridFSBucket(db, bucket_name="resumes")


# 1) Upload resume (stores file in GridFS + metadata in resumes collection)
@router.post("", status_code=status.HTTP_201_CREATED)
async def upload_resume(
    file: UploadFile = File(...),
    resume_name: str = Form(...),
    job_description: str = Form(""),
    current_user: dict = Depends(get_current_user)
):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    fs = get_gridfs()
    content = await file.read()  # bytes

    # store file in GridFS (returns ObjectId)
    file_id = await fs.upload_from_stream(
        file.filename,
        content,
        metadata={"user_id": current_user["id"], "uploaded_at": datetime.utcnow().isoformat()}
    )

    # parse and score
    parsed_text = extract_text_from_pdf(content)
    scoring = simple_keyword_score(parsed_text, job_description)
    score = scoring.get("score", 0)

    # store metadata document (use resume_doc_id as primary id)
    resume_doc = {
        "user_id": ObjectId(current_user["id"]),
        "file_id": file_id,                      # ObjectId
        "resume_name": resume_name,
        "original_name": file.filename,
        "uploaded_at": datetime.utcnow(),
        "score": score,
        "matched_keywords": scoring.get("matched_keywords", []),
        "job_description": job_description,
        "parsed_text": parsed_text[:20000]
    }
    result = await resumes_collection.insert_one(resume_doc)

    return JSONResponse({
        "id": str(result.inserted_id),          # resume metadata id (use this in frontend)
        "file_id": str(file_id),
        "resume_name": resume_name,
        "score": score,
        "file_url": f"{BACKEND_URL}/api/resumes/file/{file_id}"
    }, status_code=status.HTTP_201_CREATED)


# 2) Stream/download raw file by GridFS file id
@router.get("/file/{file_id}")
async def get_resume_file(file_id: str):
    try:
        oid = ObjectId(file_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid file ID")

    fs = get_gridfs()
    # look up GridFS file metadata to guess content-type
    file_doc = await db["resumes.files"].find_one({"_id": oid})  # motor stores files in <bucket>.files
    if not file_doc:
        # also try default collection name
        file_doc = await db["resumes.files"].find_one({"_id": oid})
    if not file_doc:
        raise HTTPException(status_code=404, detail="File not found")

    filename = file_doc.get("filename", "file")
    content_type, _ = mimetypes.guess_type(filename)
    content_type = content_type or "application/octet-stream"

    # open download stream and stream in chunks
    try:
        download_stream = await fs.open_download_stream(oid)
    except Exception:
        raise HTTPException(status_code=404, detail="File not found")

    async def streamer():
        chunk_size = 1024 * 256
        while True:
            chunk = await download_stream.read(chunk_size)
            if not chunk:
                break
            yield chunk
        await download_stream.close()

    return StreamingResponse(streamer(), media_type=content_type, headers={"Content-Disposition": "inline"})


# 3) Get resume metadata by resume _id (used by frontend preview page)
@router.get("/{resume_id}")
async def get_resume_metadata(resume_id: str, current_user: dict = Depends(get_current_user)):
    try:
        rid = ObjectId(resume_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid resume id")

    doc = await resumes_collection.find_one({"_id": rid, "user_id": ObjectId(current_user["id"])})
    if not doc:
        raise HTTPException(status_code=404, detail="Resume not found")

    return {
        "id": str(doc["_id"]),
        "file_id": str(doc["file_id"]),
        "resume_name": doc.get("resume_name"),
        "original_name": doc.get("original_name"),
        "file_url": f"{BACKEND_URL}/api/resumes/file/{doc['file_id']}",
        "score": doc.get("score"),
        "matched_keywords": doc.get("matched_keywords", []),
        "uploaded_at": doc.get("uploaded_at")
    }


# 4) List resumes for current user
@router.get("")
async def list_resumes(current_user: dict = Depends(get_current_user)):
    cursor = resumes_collection.find({"user_id": ObjectId(current_user["id"])}).sort("uploaded_at", -1).limit(200)
    docs = await cursor.to_list(length=200)
    results = [
        {
            "id": str(d["_id"]),                    # metadata id
            "resume_name": d.get("resume_name"),
            "uploaded_at": d.get("uploaded_at"),
            "score": d.get("score"),
            "file_url": f"{BACKEND_URL}/api/resumes/file/{d['file_id']}",
        } for d in docs
    ]
    return results


# 5) Delete resume (both GridFS file and metadata)
@router.delete("/{resume_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_resume(resume_id: str, current_user: dict = Depends(get_current_user)):
    try:
        rid = ObjectId(resume_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid resume id")

    doc = await resumes_collection.find_one({"_id": rid, "user_id": ObjectId(current_user["id"])})
    if not doc:
        raise HTTPException(status_code=404, detail="Resume not found")

    file_oid = doc["file_id"]
    fs = get_gridfs()
    # delete GridFS file
    try:
        await fs.delete(file_oid)
    except Exception:
        # continue to delete metadata even if file missing
        pass

    # delete metadata
    await resumes_collection.delete_one({"_id": rid})
    return JSONResponse(status_code=status.HTTP_204_NO_CONTENT, content=None)

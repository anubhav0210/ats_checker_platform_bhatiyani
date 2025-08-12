from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException, status
from fastapi.responses import JSONResponse, StreamingResponse
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorGridFSBucket
from datetime import datetime
from bson import ObjectId
from dotenv import load_dotenv
import os
from utils import extract_text_from_pdf, simple_keyword_score
from auth import get_current_user

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME", "resume_db")

client = AsyncIOMotorClient(MONGO_URI)
db = client[DB_NAME]
resumes_collection = db["resumes"]

router = APIRouter(prefix="/api/resumes", tags=["resumes"])

# GridFS helper
def get_gridfs():
    return AsyncIOMotorGridFSBucket(db, bucket_name="resumes")


# ----------------------------
# 1. Upload Resume
# ----------------------------
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
    file_content = await file.read()

    # Store PDF in GridFS
    upload_stream = fs.open_upload_stream(
        file.filename,
        metadata={
            "user_id": current_user["id"],
            "uploaded_at": datetime.utcnow().isoformat()
        }
    )
    await upload_stream.write(file_content)
    await upload_stream.close()
    file_id = upload_stream._id

    # Extract & score
    parsed_text = extract_text_from_pdf(file_content)
    scoring = simple_keyword_score(parsed_text, job_description)

    # Save metadata
    resume_doc = {
        "user_id": ObjectId(current_user["id"]),
        "file_id": file_id,
        "resume_name": resume_name,
        "original_name": file.filename,
        "uploaded_at": datetime.utcnow(),
        "score": scoring["score"],
        "matched_keywords": scoring.get("matched_keywords", []),
        "job_description": job_description,
        "parsed_text": parsed_text[:20000]
    }
    await resumes_collection.insert_one(resume_doc)

    return {
        "id": str(file_id),
        "resume_name": resume_name,
        "score": scoring["score"],
        "file_url": f"/api/resumes/{file_id}/file",
        "parsed_text": parsed_text
    }


# ----------------------------
# 2. Download Resume
# ----------------------------
@router.get("/{file_id}/file")
async def get_resume_file(file_id: str):
    try:
        oid = ObjectId(file_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid file ID")

    fs = get_gridfs()
    try:
        download_stream = await fs.open_download_stream(oid)
        return StreamingResponse(
            download_stream,
            media_type="application/pdf",
            headers={"Content-Disposition": "inline"}
        )
    except:
        raise HTTPException(404, "PDF not found")


# ----------------------------
# 3. Get Metadata
# ----------------------------
@router.get("/{file_id}")
async def get_resume_metadata(file_id: str):
    try:
        oid = ObjectId(file_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid ID format")

    doc = await resumes_collection.find_one({"file_id": oid})
    if not doc:
        raise HTTPException(404, "Resume not found")

    return {
        "id": str(doc["_id"]),
        "resume_name": doc.get("resume_name"),
        "original_name": doc.get("original_name"),
        "file_url": f"/api/resumes/{file_id}/file",
        "score": doc.get("score"),
        "matched_keywords": doc.get("matched_keywords", []),
        "uploaded_at": doc.get("uploaded_at")
    }


# ----------------------------
# 4. List Resumes
# ----------------------------
@router.get("")
async def list_resumes(current_user: dict = Depends(get_current_user)):
    cursor = resumes_collection.find({"user_id": ObjectId(current_user["id"])})
    docs = await cursor.to_list(length=100)

    return [
        {
            "id": str(d["_id"]),
            "resume_name": d.get("resume_name"),
            "file_url": f"/api/resumes/{d['file_id']}/file",
            "score": d.get("score"),
            "uploaded_at": d.get("uploaded_at")
        } for d in docs
    ]


# ----------------------------
# 5. Delete Resume
# ----------------------------
@router.delete("/{file_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_resume(file_id: str, current_user: dict = Depends(get_current_user)):
    try:
        oid = ObjectId(file_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid ID format")

    fs = get_gridfs()
    try:
        await fs.delete(oid)
    except:
        raise HTTPException(status_code=404, detail="File not found in GridFS")

    await resumes_collection.delete_one({
        "file_id": oid,
        "user_id": ObjectId(current_user["id"])
    })

    return JSONResponse(status_code=status.HTTP_204_NO_CONTENT, content=None)

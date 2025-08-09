from fastapi import APIRouter, File, UploadFile
import random

router = APIRouter()

@router.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
    # Placeholder ATS scoring
    score = random.randint(50, 100)
    return {
        "filename": file.filename,
        "score_output": {
            "ats_score": score,
            "skills_match": random.randint(50, 100),
            "experience_match": random.randint(50, 100)
        }
    }

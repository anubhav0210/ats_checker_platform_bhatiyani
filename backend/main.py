from fastapi import FastAPI, File, UploadFile
import fitz  # PyMuPDF
import io

app = FastAPI()

@app.post("/parse-pdf/")
async def parse_pdf(file: UploadFile = File(...)):
    contents = await file.read()
    text = extract_text_from_pdf(contents)
    return {"text": text}

def extract_text_from_pdf(file_bytes: bytes) -> str:
    text = ""
    with fitz.open(stream=file_bytes, filetype="pdf") as doc:
        for page in doc:
            text += page.get_text()
    return text.strip()
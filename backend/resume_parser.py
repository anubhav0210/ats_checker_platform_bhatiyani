# resume_parser.py
# Function to simulate parsing a PDF resume and returning scored data
def parse_resume(file_bytes):
    # In real application, use pdfminer or spacy to extract real data
    return {
        "name": "Test User",
        "skills": ["Python", "React"],
        "score": 82,
        "skills_score": 70,
        "experience_score": 90,
        "format_score": 60,
        "keywords_score": 85
    } 
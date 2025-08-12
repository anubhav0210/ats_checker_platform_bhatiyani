from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()  # Load .env variables

app = FastAPI()

# CORS Configuration (Allow Vercel & localhost)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://your-frontend.vercel.app"  # Replace with Vercel URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB Connection
client = MongoClient(os.getenv("MONGODB_URI"))
db = client.get_database("ats_checker")

# Example FastAPI route
@app.get("/")
def read_root():
    return {"message": "ATS Checker Backend is running!"}
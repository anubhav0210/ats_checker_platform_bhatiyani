from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017/resume_ats")
DB_NAME = os.environ.get("DB_NAME", "resume_ats")

client: AsyncIOMotorClient = AsyncIOMotorClient(MONGO_URI)
db = client[DB_NAME]

# Collections recommended
users_collection = db["users"]
resumes_collection = db["resumes"]
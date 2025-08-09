from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from auth.routes import router as auth_router
from routes.resume_routes import router as resume_router

app = FastAPI(title="Smart Hiring Backend", version="1.0.0")

# CORS setup so frontend can connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(resume_router, prefix="/resume", tags=["Resume ATS"])

@app.get("/")
def root():
    return {"message": "Welcome to Smart Hiring API"}

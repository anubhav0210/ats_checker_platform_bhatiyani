from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from database.connection import db
from auth.utils import hash_password, verify_password, create_access_token

router = APIRouter()

class RegisterModel(BaseModel):
    username: str
    email: str
    password: str

class LoginModel(BaseModel):
    email: str
    password: str

@router.post("/register")
def register_user(user: RegisterModel):
    existing_user = db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pw = hash_password(user.password)
    db.users.insert_one({
        "username": user.username,
        "email": user.email,
        "password": hashed_pw
    })
    return {"message": "User registered successfully"}

@router.post("/login")
def login_user(user: LoginModel):
    db_user = db.users.find_one({"email": user.email})
    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid email or password")

    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    token = create_access_token({"sub": db_user["email"]})
    return {"access_token": token, "token_type": "bearer"}

from pydantic import BaseModel, Field
from typing import Optional
from .utils import PyObjectId
from pydantic import BaseModel, EmailStr
from typing import Optional


from pydantic import BaseModel, EmailStr
from typing import Optional

class UserRegister(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserInDB(BaseModel):
    username: str
    email: EmailStr
    hashed_password: str

class ResumeCreate(BaseModel):
    name: str | None = None  # optional friendly name
    job_description: str | None = None

class ResumeInDB(BaseModel):
    id: str = Field(..., alias="_id")
    filename: str
    name: Optional[str] = None
    uploaded_at: str
    file_path: str
    file_url: Optional[str] = None
    score: Optional[int] = None
    parsed_text: Optional[str] = None
    job_description: Optional[str] = None

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
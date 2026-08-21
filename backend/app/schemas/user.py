from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    lastname: str
    firstname: str
    email: EmailStr
    password: str
    telephone: str

class UserResponse(BaseModel):
    id: int
    lastname: str
    firstname: str
    email: EmailStr
    telephone: str
    role:str

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
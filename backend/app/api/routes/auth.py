from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr

from app.core.security import hash_password, verify_password, create_access_token
from app.store import store


router = APIRouter()


class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class AadhaarLoginRequest(BaseModel):
    aadhaar: str
    otp: str
    name: str | None = None


@router.post("/register")
def register(payload: RegisterRequest):
    if payload.email in store.users:
        raise HTTPException(status_code=409, detail="User already exists")
    store.users[payload.email] = {
        "name": payload.name,
        "email": payload.email,
        "password_hash": hash_password(payload.password),
    }
    token = create_access_token(payload.email)
    return {"access_token": token, "token_type": "bearer"}


@router.post("/login")
def login(payload: LoginRequest):
    user = store.users.get(payload.email)
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token(payload.email)
    return {"access_token": token, "token_type": "bearer"}


@router.post("/aadhaar-login")
def aadhaar_login(payload: AadhaarLoginRequest):
    if not payload.aadhaar.isdigit() or len(payload.aadhaar) != 12:
        raise HTTPException(status_code=400, detail="Invalid Aadhaar number")
    if not payload.otp.isdigit() or len(payload.otp) != 6:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    user_key = f"aadhaar:{payload.aadhaar}"
    if user_key not in store.users:
        store.users[user_key] = {
            "name": payload.name or "Aadhaar User",
            "aadhaar": payload.aadhaar,
        }
    token = create_access_token(user_key)
    return {"access_token": token, "token_type": "bearer"}

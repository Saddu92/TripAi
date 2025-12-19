from fastapi import APIRouter, HTTPException
from app.database import db
from app.utils.security import hash_password, verify_password, create_access_token, needs_rehash

router = APIRouter()
users = db["users"]

@router.post("/register")
def signup(payload: dict):
    if users.find_one({"email": payload["email"]}):
        raise HTTPException(status_code=400, detail="Email already exists")

    user = {
        "email": payload["email"],
        "password": hash_password(payload["password"]),
        "role":"user"
    }

    users.insert_one(user)
    return {"message": "User created successfully"}

@router.post("/login")
def login(payload: dict):
    user = users.find_one({"email": payload["email"]})
    if not user or not verify_password(payload["password"], user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Upgrade hash if needed (e.g., migrating from bcrypt -> pbkdf2_sha256)
    if needs_rehash(user["password"]):
        new_hash = hash_password(payload["password"])
        users.update_one({"_id": user["_id"]}, {"$set": {"password": new_hash}})

    token = create_access_token({
        "user_id": str(user["_id"]),
        "email": user["email"],
        "role": user.get("role", "user")
    })

    return {
        "access_token": token,
        "token_type": "bearer"
    }
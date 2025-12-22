from fastapi import APIRouter, HTTPException
from google.oauth2 import id_token
from google.auth.transport import requests
import os

from app.database import db
from app.utils.security import (
    hash_password,
    verify_password,
    create_access_token,
    needs_rehash
)

router = APIRouter()
users = db["users"]

# ---------------- REGISTER ----------------
@router.post("/register")
def signup(payload: dict):
    if users.find_one({"email": payload["email"]}):
        raise HTTPException(status_code=400, detail="Email already exists")

    user = {
        "email": payload["email"],
        "password": hash_password(payload["password"]),
        "role": "user",
        "provider": "local"
    }

    users.insert_one(user)
    return {"message": "User created successfully"}

# ---------------- LOGIN ----------------
@router.post("/login")
def login(payload: dict):
    user = users.find_one({"email": payload["email"]})

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if user.get("provider") == "google":
        raise HTTPException(
            status_code=400,
            detail="Please login using Google"
        )

    if not verify_password(payload["password"], user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Upgrade hash if needed
    if needs_rehash(user["password"]):
        users.update_one(
            {"_id": user["_id"]},
            {"$set": {"password": hash_password(payload["password"])}}
        )

    token = create_access_token({
        "user_id": str(user["_id"]),
        "email": user["email"],
        "role": user["role"]
    })

    return {"access_token": token, "token_type": "bearer"}

# ---------------- GOOGLE LOGIN ----------------
@router.post("/google")
def google_login(payload: dict):
    token = payload.get("token")

    if not token:
        raise HTTPException(status_code=400, detail="Token missing")

    try:
        info = id_token.verify_oauth2_token(
            token,
            requests.Request(),
            os.getenv("GOOGLE_CLIENT_ID")
        )
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid Google token")

    email = info["email"]
    name = info.get("name")
    picture = info.get("picture")

    user = users.find_one({"email": email})

    if not user:
        result = users.insert_one({
            "email": email,
            "name": name,
            "picture": picture,
            "role": "user",
            "provider": "google"
        })
        user_id = str(result.inserted_id)
    else:
        user_id = str(user["_id"])

    jwt_token = create_access_token({
        "user_id": user_id,
        "email": email,
        "role": "user"
    })

    return {"access_token": jwt_token, "token_type": "bearer"}

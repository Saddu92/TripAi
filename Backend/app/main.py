print("🚀 USING THIS MAIN FILE!!!")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import itineraries, ai, auth, admin

app = FastAPI()

# ✅ CORRECT CORS CONFIG
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",              # local dev
        "https://trip-ai-opal.vercel.app",     # production
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers load AFTER CORS
app.include_router(itineraries.router, prefix="/itineraries", tags=["Itineraries"])
app.include_router(ai.router, prefix="/ai", tags=["AI"])
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(admin.router, prefix="/admin", tags=["Admin"])

@app.get("/")
def home():
    return {"message": "Backend is running successfully!"}

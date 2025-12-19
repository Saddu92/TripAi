print("🚀 USING THIS MAIN FILE!!!")
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import itineraries, ai
from app.routers import itineraries, ai, auth

app = FastAPI()

# CORS MUST BE HERE
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers load AFTER CORS
app.include_router(itineraries.router, prefix="/itineraries", tags=["Itineraries"])
app.include_router(ai.router, prefix="/ai", tags=["AI"])
app.include_router(auth.router, prefix="/auth", tags=["Auth"])


@app.get("/")
def home():
    return {"message": "Backend is running successfully!"}

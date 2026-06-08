from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Soil Advisory API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Soil Advisory API is running!", "status": "ok"}

@app.get("/test")
def test():
    return {"message": "Hello from CodeHarvest Team!", "project": "Soil Advisory System"}
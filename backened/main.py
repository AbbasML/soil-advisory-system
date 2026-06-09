from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
from dotenv import load_dotenv
import os

from rule_engine import (
    CROPS,
    detect_deficiencies,
    get_fertilizer_recommendations,
    get_improvement_plan,
    calculate_suitability_all_crops
)

# Load environment variables
load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")

# FastAPI App
app = FastAPI(title="AI Soil Health Advisory API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# Health Check
# --------------------------------------------------
@app.get("/")
def home():
    return {
        "message": "AI Soil Health Advisory API Running",
        "status": "success"
    }


@app.get("/test")
def test():
    return {
        "message": "Hello from CodeHarvest Team!",
        "project": "Soil Advisory System"
    }


# --------------------------------------------------
# Soil Analysis Endpoint
# --------------------------------------------------
@app.post("/analyze")
async def analyze_soil(data: dict):

    try:
        crop = data["crop"].lower()

        if crop not in CROPS:
            return {
                "success": False,
                "message": f"Crop '{crop}' not found"
            }

        ph = float(data["ph"])
        N = float(data["nitrogen"])
        P = float(data["phosphorus"])
        K = float(data["potassium"])

        farm_acres = float(data.get("farm_acres", 1))
        language = data.get("language", "English")

        # Rule Engine
        deficiencies = detect_deficiencies(
            crop, ph, N, P, K
        )

        fertilizers = get_fertilizer_recommendations(
            crop,
            ph,
            N,
            P,
            K,
            farm_acres
        )

        improvement_plan = get_improvement_plan(
            crop,
            ph,
            N,
            P,
            K
        )

        # Gemini Summary
        prompt = f"""
You are an agricultural advisor for Indian farmers.

Crop: {CROPS[crop]['name']}

Soil Test:
- pH: {ph}
- Nitrogen: {N}
- Phosphorus: {P}
- Potassium: {K}

Detected Problems:
{deficiencies}

Fertilizer Recommendations:
{fertilizers}

Improvement Plan:
{improvement_plan}

Write a simple farmer-friendly advisory in {language}.
Maximum 5 short sentences.
Mention:
1. Whether soil is suitable.
2. Main issues.
3. Recommended action.
4. Positive encouragement.
"""

        ai_summary = model.generate_content(prompt)

        return {
            "success": True,
            "crop": CROPS[crop]["name"],
            "deficiencies": deficiencies,
            "fertilizer_recommendations": fertilizers,
            "improvement_plan": improvement_plan,
            "ai_summary": ai_summary.text,
            "overall_status":
                "Good"
                if len(deficiencies) == 0
                else "Needs Improvement"
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }


# --------------------------------------------------
# Crop Comparison Endpoint
# --------------------------------------------------
@app.post("/compare-crops")
async def compare_crops(data: dict):

    try:
        ph = float(data["ph"])
        N = float(data["nitrogen"])
        P = float(data["phosphorus"])
        K = float(data["potassium"])

        rankings = calculate_suitability_all_crops(
            ph,
            N,
            P,
            K
        )

        return {
            "success": True,
            "rankings": rankings[:10]
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }


# --------------------------------------------------
# Chatbot Endpoint
# --------------------------------------------------
@app.post("/chat")
async def chat(data: dict):

    try:
        user_message = data["message"]
        language = data.get("language", "English")
        soil_context = data.get("soil_context", "")

        prompt = f"""
You are KisanBot, an agricultural assistant.

Language: {language}

Soil Context:
{soil_context}

Farmer Question:
{user_message}

Answer in a simple and practical way.
Keep response under 150 words.
"""

        response = model.generate_content(prompt)

        return {
            "reply": response.text,
            "bot_name": "KisanBot"
        }

    except Exception as e:
        return {
            "error": str(e)
        }


# --------------------------------------------------
# Run
# --------------------------------------------------
# uvicorn main:app --reload
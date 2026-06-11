from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from google import genai
import os

from rule_engine import (
    CROPS,
    detect_deficiencies,
    get_fertilizer_recommendations,
    get_improvement_plan,
    calculate_suitability_all_crops,
    calculate_soil_health_score
)

# --------------------------------------------------
# Load Environment Variables
# --------------------------------------------------
load_dotenv()

# Gemini Client
client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

# --------------------------------------------------
# FastAPI App
# --------------------------------------------------
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

        language = data.get("language", "English")

        # Rule Engine
        deficiencies = detect_deficiencies(
            crop,
            ph,
            N,
            P,
            K
        )

        fertilizers = get_fertilizer_recommendations(
            crop,
            ph,
            N,
            P,
            K
        )

        improvement_plan = get_improvement_plan(
            crop,
            ph,
            N,
            P,
            K
        )

        soil_health = calculate_soil_health_score(
            crop,
            ph,
            N,
            P,
            K
        )

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

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        ai_summary = response.text

        return {
            "success": True,

            "soil_health_score": soil_health["score"],
            "soil_health_status": soil_health["status"],

            "crop": CROPS[crop]["name"],

            "ph": ph,
            "N": N,
            "P": P,
            "K": K,

            "deficiencies": deficiencies,
            "fertilizer_recommendations": fertilizers,
            "improvement_plan": improvement_plan,

            "ai_summary": ai_summary,

            "overall_status": (
                "Good"
                if len(deficiencies) == 0
                else "Needs Attention"
            )
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

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

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
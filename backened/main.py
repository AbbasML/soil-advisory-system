import joblib
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from google import genai
import os

# --------------------------------------------------
# Load ML Models
# --------------------------------------------------
crop_model = joblib.load("crop_model.pkl")
label_encoder = joblib.load("label_encoder.pkl")

# --------------------------------------------------
# Rule Engine Imports
# --------------------------------------------------
from rule_engine import (
    CROPS,
    detect_deficiencies,
    get_fertilizer_recommendations,
    get_improvement_plan,
    calculate_suitability_all_crops,
    calculate_soil_health_score
)

# --------------------------------------------------
# Environment Setup
# --------------------------------------------------
load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

# --------------------------------------------------
# FastAPI App
# --------------------------------------------------
app = FastAPI(title="AI Soil Health Advisory API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------------------------
# ML Prediction Function
# --------------------------------------------------
def predict_crop_ml(N, P, K, temperature, humidity, ph, rainfall):
    features = [[N, P, K, temperature, humidity, ph, rainfall]]
    prediction = crop_model.predict(features)
    return label_encoder.inverse_transform(prediction)[0]

# --------------------------------------------------
# Safe Gemini Function (IMPORTANT FIX)
# --------------------------------------------------
def get_ai_summary(prompt):
    try:
        response = client.models.generate_content(
            model="gemini-1.5-flash-latest",
            contents=prompt
        )
        return response.text

    except Exception as e:
        print("Gemini Error:", e)
        return "AI service is temporarily unavailable. Showing rule-based analysis only."

# --------------------------------------------------
# Routes
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
# MAIN ANALYSIS ENDPOINT
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

        # Safe conversions
        ph = float(data["ph"])
        N = float(data["nitrogen"])
        P = float(data["phosphorus"])
        K = float(data["potassium"])
        temperature = float(data["temperature"])
        humidity = float(data["humidity"])
        rainfall = float(data["rainfall"])

        language = data.get("language", "English")

        # --------------------------------------------------
        # ML Prediction
        # --------------------------------------------------
        ml_crop = predict_crop_ml(
            N, P, K,
            temperature, humidity, ph, rainfall
        )

        # --------------------------------------------------
        # Rule Engine
        # --------------------------------------------------
        deficiencies = detect_deficiencies(crop, ph, N, P, K)

        fertilizers = get_fertilizer_recommendations(crop, ph, N, P, K)

        improvement_plan = get_improvement_plan(crop, ph, N, P, K)

        soil_health = calculate_soil_health_score(crop, ph, N, P, K)

        # --------------------------------------------------
        # AI Prompt
        # --------------------------------------------------
        prompt = f"""
You are an expert agricultural advisor for Indian farmers.

IMPORTANT:
- Respond ONLY in {language}.
- Keep it simple and practical.

Crop: {CROPS[crop]['name']}

Soil:
- pH: {ph}
- N: {N}
- P: {P}
- K: {K}

Deficiencies:
{deficiencies}

Fertilizers:
{fertilizers}

Plan:
{improvement_plan}

Give short farmer advice in 4-5 lines.
"""

        ai_summary = get_ai_summary(prompt)

        # --------------------------------------------------
        # FINAL RESPONSE (NEVER EMPTY)
        # --------------------------------------------------
        return {
            "success": True,

            "soil_health_score": soil_health["score"],
            "soil_health_status": soil_health["status"],

            "crop": CROPS[crop]["name"],
            "ml_predicted_crop": ml_crop,

            "ph": ph,
            "N": N,
            "P": P,
            "K": K,

            "deficiencies": deficiencies,
            "fertilizer_recommendations": fertilizers,
            "improvement_plan": improvement_plan,

            "ai_summary": ai_summary,

            "overall_status": "Good" if len(deficiencies) == 0 else "Needs Attention"
        }

    except Exception as e:
        print("Backend Error:", e)
        return {
            "success": False,
            "error": str(e)
        }


# --------------------------------------------------
# CROP COMPARISON
# --------------------------------------------------
@app.post("/compare-crops")
async def compare_crops(data: dict):

    try:
        ph = float(data["ph"])
        N = float(data["nitrogen"])
        P = float(data["phosphorus"])
        K = float(data["potassium"])

        rankings = calculate_suitability_all_crops(ph, N, P, K)

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
# CHATBOT
# --------------------------------------------------
@app.post("/chat")
async def chat(data: dict):

    try:
        user_message = data["message"]
        language = data.get("language", "English")
        soil_context = data.get("soil_context", "")

        prompt = f"""
You are KisanBot.

Soil Context:
{soil_context}

Question:
{user_message}

Reply in simple farmer language under 150 words.
"""

        response = client.models.generate_content(
            model="gemini-1.5-flash-latest",
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
import joblib
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from google import genai
from google.genai import types
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
    calculate_soil_health_score,
    get_suitability_reasons
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
def get_ai_summary(prompt, language="English"):
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=f"You are an expert agricultural advisor for Indian farmers. You MUST respond ONLY in the following language: {language}. Keep your response simple and under 5 lines."
            )
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


@app.get("/crops")
def get_crops():
    crop_list = []
    for key, val in CROPS.items():
        if key not in ["deficiency_rules", "fertilizer_recommendations", "soil_correction", "improvement_plan"] and isinstance(val, dict) and "name" in val:
            crop_list.append({
                "id": key,
                "name": val["name"],
                "hindi_name": val.get("hindi_name", val["name"])
            })
    return crop_list


# --------------------------------------------------
# MAIN ANALYSIS ENDPOINT
# --------------------------------------------------
@app.post("/analyze")
async def analyze_soil(data: dict):

    try:
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
        predicted_crop = predict_crop_ml(
            N, P, K,
            temperature, humidity, ph, rainfall
        )
        
        crop_key = predicted_crop.lower()

        # --------------------------------------------------
        # Rule Engine
        # --------------------------------------------------
        deficiencies = detect_deficiencies(crop_key, ph, N, P, K)
        fertilizers = get_fertilizer_recommendations(crop_key, ph, N, P, K)
        improvement_plan = get_improvement_plan(crop_key, ph, N, P, K)
        soil_health = calculate_soil_health_score(crop_key, ph, N, P, K)

        # Calculate alternative crop using rule-engine rankings
        rankings = calculate_suitability_all_crops(ph, N, P, K)
        alternative_crop_display = "Wheat"
        for r in rankings:
            if r["crop"].lower() != crop_key:
                alternative_crop_display = r["crop"]
                break

        # Calculate suitability reasons for recommended crop
        suitability_reasons = get_suitability_reasons(
            crop_key, ph, N, P, K,
            temperature, humidity, rainfall
        )

        # --------------------------------------------------
        # AI Prompt
        # --------------------------------------------------
        prompt = f"""
Recommended Crop: {predicted_crop.capitalize()}
Alternative Crop: {alternative_crop_display}

Soil Metrics:
- pH: {ph}
- Nitrogen (N): {N} kg/ha
- Phosphorus (P): {P} kg/ha
- Potassium (K): {K} kg/ha
- Temperature: {temperature} °C
- Humidity: {humidity} %
- Rainfall: {rainfall} mm

Detected Deficiencies:
{deficiencies}

Recommended Fertilizers:
{fertilizers}

Improvement Plan:
{improvement_plan}
"""

        ai_summary = get_ai_summary(prompt, language)

        # --------------------------------------------------
        # FINAL RESPONSE (NEVER EMPTY)
        # --------------------------------------------------
        return {
            "success": True,

            "soil_health_score": soil_health["score"],
            "soil_health_status": soil_health["status"],

            "recommended_crop": predicted_crop.capitalize(),
            "alternative_crop": alternative_crop_display,

            "ph": ph,
            "N": N,
            "P": P,
            "K": K,

            "deficiencies": deficiencies,
            "fertilizer_recommendations": fertilizers,
            "improvement_plan": improvement_plan,

            "ai_summary": ai_summary,
            "suitability_reasons": suitability_reasons,

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

        sys_instruction = f"""You are KisanBot, an expert agricultural chatbot assistant for Indian farmers.
IMPORTANT:
- You MUST respond ONLY in the following language: {language}.
- Translate all agricultural advice, recommendations, and greeting answers to {language}.
- Keep your response under 150 words.
- Keep it extremely simple, practical, and friendly.
"""

        user_content = f"""Soil Context (use this to help answer if relevant):
{soil_context}

User Query:
{user_message}
"""

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=user_content,
            config=types.GenerateContentConfig(
                system_instruction=sys_instruction
            )
        )

        return {
            "reply": response.text,
            "bot_name": "KisanBot"
        }

    except Exception as e:
        return {
            "error": str(e)
        }
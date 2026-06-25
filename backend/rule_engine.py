import os
import json

# -----------------------------------------
# Load Crop Database (SAFE PATH)
# -----------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FILE_PATH = os.path.join(BASE_DIR, "..", "data", "crops.json")

with open(FILE_PATH, "r", encoding="utf-8") as file:
    CROPS = json.load(file)


# -----------------------------------------
# Helper: Safe Crop Fetch
# -----------------------------------------
def get_crop_data(crop):
    crop_key = crop.lower().strip()
    if crop_key in CROPS:
        return CROPS[crop_key]

    pulses = ["blackgram", "chickpea", "kidneybeans", "lentil", "mothbeans", "mungbean", "pigeonpeas", "soybean", "groundnut"]
    fruits = ["apple", "banana", "grapes", "mango", "orange", "papaya", "pomegranate", "watermelon", "muskmelon", "coconut"]

    if crop_key in pulses:
        return {
            "name": crop.capitalize(),
            "hindi_name": crop.capitalize(),
            "season": "Kharif/Rabi",
            "soil_requirements": {
                "ph": {"min": 6.0, "max": 7.5, "optimal": 6.8},
                "nitrogen": {"min": 20, "max": 60, "unit": "kg/ha"},
                "phosphorus": {"min": 25, "max": 60, "unit": "kg/ha"},
                "potassium": {"min": 20, "max": 60, "unit": "kg/ha"},
                "organic_carbon": {"min": 0.5, "optimal": 0.75, "unit": "%"}
            },
            "climate": {
                "temperature": {"min": 15, "max": 30, "unit": "°C"},
                "rainfall": {"min": 40, "max": 100, "unit": "cm"}
            },
            "soil_type": ["Sandy Loam", "Loamy", "Clay Loam"]
        }
    elif crop_key in fruits:
        return {
            "name": crop.capitalize(),
            "hindi_name": crop.capitalize(),
            "season": "Annual",
            "soil_requirements": {
                "ph": {"min": 5.5, "max": 7.0, "optimal": 6.2},
                "nitrogen": {"min": 80, "max": 160, "unit": "kg/ha"},
                "phosphorus": {"min": 40, "max": 90, "unit": "kg/ha"},
                "potassium": {"min": 100, "max": 200, "unit": "kg/ha"},
                "organic_carbon": {"min": 0.6, "optimal": 0.8, "unit": "%"}
            },
            "climate": {
                "temperature": {"min": 20, "max": 35, "unit": "°C"},
                "rainfall": {"min": 60, "max": 150, "unit": "cm"}
            },
            "soil_type": ["Loamy", "Silt Loam", "Sandy Clay Loam"]
        }
    else:
        return {
            "name": crop.capitalize(),
            "hindi_name": crop.capitalize(),
            "season": "Kharif",
            "soil_requirements": {
                "ph": {"min": 5.5, "max": 7.0, "optimal": 6.5},
                "nitrogen": {"min": 100, "max": 200, "unit": "kg/ha"},
                "phosphorus": {"min": 30, "max": 80, "unit": "kg/ha"},
                "potassium": {"min": 80, "max": 160, "unit": "kg/ha"},
                "organic_carbon": {"min": 0.5, "optimal": 0.75, "unit": "%"}
            },
            "climate": {
                "temperature": {"min": 18, "max": 32, "unit": "°C"},
                "rainfall": {"min": 80, "max": 200, "unit": "cm"}
            },
            "soil_type": ["Loamy", "Clay Loam", "Alluvial"]
        }


# -----------------------------------------
# Helper: Scoring Function
# -----------------------------------------

def score_param(value, req):

    min_val = req["min"]
    max_val = req["max"]

    # Use optimal if available
    optimal = req.get(
        "optimal",
        (min_val + max_val) / 2
    )

    # Inside range
    if min_val <= value <= max_val:

        max_distance = max(
            abs(optimal - min_val),
            abs(max_val - optimal)
        )

        if max_distance == 0:
            return 100

        distance = abs(value - optimal)

        score = 100 - (
            distance / max_distance
        ) * 20

        return round(score)

    # Below range
    if value < min_val:

        percent_diff = (
            (min_val - value) / min_val
        ) * 100

        return max(0, round(100 - percent_diff))

    # Above range
    percent_diff = (
        (value - max_val) / max_val
    ) * 100

    return max(0, round(100 - percent_diff))

# -----------------------------------------
# Detect Deficiencies
# -----------------------------------------
def detect_deficiencies(crop, ph, N, P, K):

    crop_data = get_crop_data(crop)
    if not crop_data:
        return ["Invalid crop selected"]

    deficiencies = []
    req = crop_data["soil_requirements"]

    # pH Check
    if ph < req["ph"]["min"]:
        deficiencies.append("Low Soil pH (Acidic)")
    elif ph > req["ph"]["max"]:
        deficiencies.append("High Soil pH (Alkaline)")

    # Nitrogen
    if N < req["nitrogen"]["min"]:
        deficiencies.append("Nitrogen Deficient")

    # Phosphorus
    if P < req["phosphorus"]["min"]:
        deficiencies.append("Phosphorus Deficient")

    # Potassium
    if K < req["potassium"]["min"]:
        deficiencies.append("Potassium Deficient")

    return deficiencies


# -----------------------------------------
# Fertilizer Recommendations
# -----------------------------------------
def get_fertilizer_recommendations(crop, ph, N, P, K):

    crop_data = get_crop_data(crop)
    if not crop_data:
        return ["Invalid crop selected"]

    recommendations = []
    req = crop_data["soil_requirements"]

    fert = CROPS.get("fertilizer_recommendations", {})

    if N < req["nitrogen"]["min"]:
        recommendations.extend(fert.get("nitrogen", []))

    if P < req["phosphorus"]["min"]:
        recommendations.extend(fert.get("phosphorus", []))

    if K < req["potassium"]["min"]:
        recommendations.extend(fert.get("potassium", []))

    return list(set(recommendations))


# -----------------------------------------
# Soil Improvement Plan
# -----------------------------------------
def get_improvement_plan(crop, ph, N, P, K):

    crop_data = get_crop_data(crop)
    if not crop_data:
        return ["Invalid crop selected"]

    plan = []

    soil_correction = CROPS.get("soil_correction", {})
    improvement_plan = CROPS.get("improvement_plan", {})

    req = crop_data["soil_requirements"]

    # pH correction
    if ph < req["ph"]["min"]:
        plan.extend(soil_correction.get("low_ph", []))
    elif ph > req["ph"]["max"]:
        plan.extend(soil_correction.get("high_ph", []))

    # general improvements
    plan.extend(improvement_plan.get("organic_matter", []))
    plan.extend(improvement_plan.get("water_management", []))

    return list(set(plan))


# -----------------------------------------
# Crop Suitability Ranking
# -----------------------------------------
def calculate_suitability_all_crops(ph, N, P, K):

    rankings = []

    for crop_key, crop_data in CROPS.items():

        # Skip config sections
        if crop_key in [
            "deficiency_rules",
            "fertilizer_recommendations",
            "soil_correction",
            "improvement_plan"
        ]:
            continue

        if "soil_requirements" not in crop_data:
            continue

        req = crop_data["soil_requirements"]

        ph_score = score_param(
            ph,
            req["ph"]
        )

        n_score = score_param(
            N,
            req["nitrogen"]
        )

        p_score = score_param(
            P,
            req["phosphorus"]
        )

        k_score = score_param(
            K,
            req["potassium"]
        )

        # Weighted score
        score = (
            ph_score * 0.20 +
            n_score * 0.30 +
            p_score * 0.25 +
            k_score * 0.25
        )

        rankings.append({
            "crop": crop_data.get(
                "name",
                crop_key
            ),
            "score": round(score, 1),
            "details": {
                "ph": ph_score,
                "nitrogen": n_score,
                "phosphorus": p_score,
                "potassium": k_score
            }
        })

    rankings.sort(
        key=lambda x: x["score"],
        reverse=True
    )

    return rankings[:5]
# -----------------------------------------
# Soil Health Score
# -----------------------------------------
def calculate_soil_health_score(
    crop,
    ph,
    N,
    P,
    K
):

    crop_data = get_crop_data(crop)

    if not crop_data:
        return {
            "score": 0,
            "status": "Unknown"
        }

    req = crop_data["soil_requirements"]

    ph_score = score_param(
        ph,
        req["ph"]
    )

    n_score = score_param(
        N,
        req["nitrogen"]
    )

    p_score = score_param(
        P,
        req["phosphorus"]
    )

    k_score = score_param(
        K,
        req["potassium"]
    )

    score = round(
        (
            ph_score +
            n_score +
            p_score +
            k_score
        ) / 4
    )

    if score >= 80:
        status = "Excellent"
    elif score >= 60:
        status = "Good"
    elif score >= 40:
        status = "Moderate"
    else:
        status = "Poor"

    return {
        "score": score,
        "status": status
    }

def get_suitability_reasons(crop, ph, N, P, K, temperature, humidity, rainfall):
    crop_data = get_crop_data(crop)
    if not crop_data:
        return {
            "ph_score": 50,
            "nutrient_score": 50,
            "temp_score": 50,
            "rainfall_score": 50
        }

    req_soil = crop_data["soil_requirements"]
    req_climate = crop_data.get("climate", {})

    # pH suitability
    ph_score = score_param(ph, req_soil["ph"])

    # Nutrient suitability
    n_score = score_param(N, req_soil["nitrogen"])
    p_score = score_param(P, req_soil["phosphorus"])
    k_score = score_param(K, req_soil["potassium"])
    nutrient_score = round((n_score + p_score + k_score) / 3)

    # Temperature suitability
    temp_score = 100
    if "temperature" in req_climate:
        temp_score = score_param(temperature, req_climate["temperature"])

    # Rainfall suitability (convert input mm to cm)
    rainfall_score = 100
    if "rainfall" in req_climate:
        rainfall_cm = rainfall / 10.0
        rainfall_score = score_param(rainfall_cm, req_climate["rainfall"])

    return {
        "ph_score": ph_score,
        "nutrient_score": nutrient_score,
        "temp_score": temp_score,
        "rainfall_score": rainfall_score
    }
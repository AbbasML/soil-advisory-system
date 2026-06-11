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
    if crop not in CROPS:
        return None
    return CROPS[crop]


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
# -----------------------------------------
# Soil Health Score
# -----------------------------------------
def calculate_soil_health_score(crop, ph, N, P, K):

    crop_data = get_crop_data(crop)

    if not crop_data:
        return {
            "score": 0,
            "status": "Unknown"
        }

    req = crop_data["soil_requirements"]

    ph_score = score_param(ph, req["ph"])
    n_score = score_param(N, req["nitrogen"])
    p_score = score_param(P, req["phosphorus"])
    k_score = score_param(K, req["potassium"])

    score = (
        ph_score * 0.25 +
        n_score * 0.25 +
        p_score * 0.25 +
        k_score * 0.25
    )

    score = round(score)

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
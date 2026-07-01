from dotenv import load_dotenv
import os
import sys

# Add backend directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from main import get_ai_summary

print("Running get_ai_summary test...")
prompt = "Recommended Crop: Rice. Soil is nitrogen deficient."
result = get_ai_summary(prompt, language="English")
print("Result:")
print(result)
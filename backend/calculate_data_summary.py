import os
import json
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report, confusion_matrix

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(BASE_DIR, "Crop_recommendation.csv")

# Load data
df = pd.read_csv(CSV_PATH, sep="\t")
df['label'] = df['label'].str.strip()

# Features & target
X = df.drop("label", axis=1)
y = df["label"]

# Train model
encoder = LabelEncoder()
y_encoded = encoder.fit_transform(y)
X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42)

model = RandomForestClassifier(n_estimators=200, random_state=42)
model.fit(X_train, y_train)

# Calculate accuracy
accuracy = model.score(X_test, y_test)

# 1. Feature Importances
importances = model.feature_importances_
indices = np.argsort(importances)[::-1]
features_ranked = [X.columns[i] for i in indices]
importances_ranked = [float(importances[i]) for i in indices]

# 2. Correlation Matrix
corr = X.corr()
correlation_data = {
    "columns": list(corr.columns),
    "values": corr.values.tolist()
}

# 3. Selected Crops for Boxplots and scatter
selected_crops = ['rice', 'wheat', 'maize', 'chickpea', 'lentil', 'apple', 'mango']
crop_stats = {}
for crop in selected_crops:
    crop_df = df[df['label'] == crop]
    crop_stats[crop] = {}
    for col in ['N', 'P', 'K', 'ph', 'rainfall']:
        col_data = crop_df[col].dropna()
        q1 = float(np.percentile(col_data, 25))
        q3 = float(np.percentile(col_data, 75))
        median = float(np.median(col_data))
        minimum = float(col_data.min())
        maximum = float(col_data.max())
        crop_stats[crop][col] = {
            "min": minimum,
            "q1": q1,
            "median": median,
            "q3": q3,
            "max": maximum,
            "mean": float(col_data.mean())
        }

# 4. Scatter Plot Data (Subsample to keep SVGs clean and lightweight)
scatter_data = []
for crop in selected_crops:
    crop_df = df[df['label'] == crop]
    # Sample up to 50 points per crop to keep the SVG light but representative
    sampled_df = crop_df.sample(n=min(50, len(crop_df)), random_state=42)
    for idx, row in sampled_df.iterrows():
        scatter_data.append({
            "label": crop.capitalize(),
            "ph": float(row["ph"]),
            "rainfall": float(row["rainfall"])
        })

# 5. Confusion Matrix for selected crops or all classes
y_pred = model.predict(X_test)
all_classes = list(encoder.classes_)
cm = confusion_matrix(y_test, y_pred)
cm_data = {
    "classes": [c.capitalize() for c in all_classes],
    "values": cm.tolist()
}

# Save summary data
summary_data = {
    "accuracy": accuracy,
    "feature_importances": {
        "features": features_ranked,
        "importances": importances_ranked
    },
    "correlation": correlation_data,
    "crop_stats": crop_stats,
    "scatter_data": scatter_data,
    "confusion_matrix": cm_data
}

output_path = os.path.join(BASE_DIR, "data_summary.json")
with open(output_path, "w") as f:
    json.dump(summary_data, f, indent=2)

print("Saved data_summary.json successfully!")

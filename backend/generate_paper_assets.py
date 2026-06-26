import os
import shutil
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report, confusion_matrix

# Set style for publication-ready plots
sns.set_theme(style="whitegrid")
plt.rcParams.update({
    'font.size': 12,
    'axes.labelsize': 14,
    'axes.titlesize': 16,
    'xtick.labelsize': 11,
    'ytick.labelsize': 11,
    'figure.titlesize': 18
})

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(BASE_DIR, "Crop_recommendation.csv")
OUTPUT_DIR = os.path.join(BASE_DIR, "..", "paper_assets")
ARTIFACTS_DIR = r"C:\Users\Siddhi\AppData\Local\Temp" # Fallback placeholder, we will get it at runtime

os.makedirs(OUTPUT_DIR, exist_ok=True)

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
print(f"Model Accuracy: {accuracy:.4f}")

# 1. Feature Importance Plot
plt.figure(figsize=(10, 6))
importances = model.feature_importances_
indices = np.argsort(importances)[::-1]
features_ranked = [X.columns[i] for i in indices]
importances_ranked = importances[indices]

# Map nice labels
nice_names = {
    'N': 'Nitrogen (N)', 'P': 'Phosphorus (P)', 'K': 'Potassium (K)',
    'ph': 'Soil pH', 'temperature': 'Temperature (°C)',
    'humidity': 'Humidity (%)', 'rainfall': 'Rainfall (mm)'
}
labels_ranked = [nice_names.get(f, f) for f in features_ranked]

sns.barplot(x=importances_ranked, y=labels_ranked, palette="viridis")
plt.title("Random Forest Classifier: Feature Importance", pad=15)
plt.xlabel("Relative Importance Score")
plt.ylabel("Soil & Environmental Features")
plt.tight_layout()
fig1_path = os.path.join(OUTPUT_DIR, "feature_importance.png")
plt.savefig(fig1_path, dpi=300)
plt.close()
print("Saved feature_importance.png")

# 2. Correlation Matrix Heatmap
plt.figure(figsize=(9, 7))
corr_matrix = X.corr()
corr_matrix.columns = [nice_names.get(col, col) for col in corr_matrix.columns]
corr_matrix.index = [nice_names.get(col, col) for col in corr_matrix.index]

mask = np.triu(np.ones_like(corr_matrix, dtype=bool))
sns.heatmap(corr_matrix, annot=True, mask=mask, cmap="coolwarm", fmt=".2f", linewidths=0.5, cbar_kws={"shrink": 0.8})
plt.title("Correlation Heatmap of Soil & Climatic Features", pad=20)
plt.tight_layout()
fig2_path = os.path.join(OUTPUT_DIR, "correlation_heatmap.png")
plt.savefig(fig2_path, dpi=300)
plt.close()
print("Saved correlation_heatmap.png")

# 3. Nutrient Requirements by Selected Crops (Boxplot)
selected_crops = ['rice', 'wheat', 'maize', 'chickpea', 'lentil', 'apple', 'mango']
df_filtered = df[df['label'].isin(selected_crops)].copy()
df_filtered['label'] = df_filtered['label'].str.capitalize()

fig, axes = plt.subplots(3, 1, figsize=(11, 14), sharex=True)
sns.boxplot(ax=axes[0], data=df_filtered, x='label', y='N', palette='Set2')
axes[0].set_title('Nitrogen (N) Requirements across Key Crops')
axes[0].set_ylabel('Nitrogen Content (kg/ha)')
axes[0].set_xlabel('')

sns.boxplot(ax=axes[1], data=df_filtered, x='label', y='P', palette='Set2')
axes[1].set_title('Phosphorus (P) Requirements across Key Crops')
axes[1].set_ylabel('Phosphorus Content (kg/ha)')
axes[1].set_xlabel('')

sns.boxplot(ax=axes[2], data=df_filtered, x='label', y='K', palette='Set2')
axes[2].set_title('Potassium (K) Requirements across Key Crops')
axes[2].set_ylabel('Potassium Content (kg/ha)')
axes[2].set_xlabel('Crop Type')

plt.xticks(rotation=15)
plt.tight_layout()
fig3_path = os.path.join(OUTPUT_DIR, "nutrient_requirements.png")
plt.savefig(fig3_path, dpi=300)
plt.close()
print("Saved nutrient_requirements.png")

# 4. Soil pH vs Rainfall Scatter Plot for Key Crops
plt.figure(figsize=(10, 7))
sns.scatterplot(data=df_filtered, x='ph', y='rainfall', hue='label', palette='deep', alpha=0.8, s=60)
plt.title("Soil pH vs. Annual Rainfall Distribution for Select Crops", pad=15)
plt.xlabel("Soil pH")
plt.ylabel("Annual Rainfall (mm)")
plt.legend(title="Crop", bbox_to_anchor=(1.05, 1), loc='upper left')
plt.tight_layout()
fig4_path = os.path.join(OUTPUT_DIR, "soil_ph_vs_rainfall.png")
plt.savefig(fig4_path, dpi=300)
plt.close()
print("Saved soil_ph_vs_rainfall.png")

# 5. Confusion Matrix for Top Crops
y_pred = model.predict(X_test)
all_classes = encoder.classes_
cm = confusion_matrix(y_test, y_pred)

plt.figure(figsize=(12, 10))
sns.heatmap(cm, annot=True, fmt="d", cmap="Blues", 
            xticklabels=[c.capitalize() for c in all_classes], 
            yticklabels=[c.capitalize() for c in all_classes],
            cbar=False)
plt.title("Model Confusion Matrix (Random Forest Classifier)", pad=20)
plt.ylabel("Actual Crop Class")
plt.xlabel("Predicted Crop Class")
plt.xticks(rotation=90)
plt.yticks(rotation=0)
plt.tight_layout()
fig5_path = os.path.join(OUTPUT_DIR, "model_performance.png")
plt.savefig(fig5_path, dpi=300)
plt.close()
print("Saved model_performance.png")

# Write text classification report to a file
report = classification_report(y_test, y_pred, target_names=[c.capitalize() for c in all_classes])
report_path = os.path.join(OUTPUT_DIR, "classification_report.txt")
with open(report_path, "w") as f:
    f.write(report)
print("Saved classification_report.txt")

import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import joblib

# Load dataset
df = pd.read_csv("Crop_recommendation.csv", sep="\t")

# Features
X = df.drop("label", axis=1)

# Target
y = df["label"]

# Encode crop labels
encoder = LabelEncoder()
y_encoded = encoder.fit_transform(y)

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y_encoded,
    test_size=0.2,
    random_state=42
)

# Train model
model = RandomForestClassifier(
    n_estimators=200,
    random_state=42
)

model.fit(X_train, y_train)

# Accuracy
accuracy = model.score(X_test, y_test)

print(f"Accuracy: {accuracy:.4f}")

# Save model
joblib.dump(model, "crop_model.pkl")
joblib.dump(encoder, "label_encoder.pkl")

print("Model saved successfully!")
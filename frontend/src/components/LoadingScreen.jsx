import { useEffect, useState } from "react";
import "./LoadingScreen.css";

const messages = [
  "🔍 Analyzing Soil Data...",
  "🤖 Running ML Model...",
  "📊 Calculating Soil Health...",
  "🌾 Ranking Crops...",
  "✅ Generating Recommendations..."
];

function LoadingScreen() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) =>
        prev < messages.length - 1 ? prev + 1 : prev
      );
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-screen">
      <div className="loading-card">
        <h1>🌱 AI Soil Analysis</h1>

        <h2>{messages[step]}</h2>

        <div className="spinner"></div>
      </div>
    </div>
  );
}

export default LoadingScreen;
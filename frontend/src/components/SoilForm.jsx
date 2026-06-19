import { useState } from "react";
import { analyzeSoil, compareCrops } from "../services/api";
import "./SoilForm.css";

function SoilForm({ onResult }) {
  const [formData, setFormData] = useState({
  crop: "Rice",
  nitrogen: "",
  phosphorus: "",
  potassium: "",
  ph: "",
  rainfall: "",
  temperature: "",
  humidity: "",
});

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  // Validate pH
  if (formData.ph < 0 || formData.ph > 14) {
    alert("pH must be between 0 and 14");
    return;
  }

  try {
    setLoading(true);

    const analysisResponse = await analyzeSoil(formData);
    const rankingResponse = await compareCrops(formData);

    if (onResult) {
      onResult(
        analysisResponse.data,
        rankingResponse.data.rankings || []
      );
    }
  } catch (error) {
    console.error(error);
    alert("Failed to analyze soil. Check backend.");
  } finally {
    setLoading(false);
  }
};

  return (
  <div className="soil-form-container">
    <div className="soil-form-header">
      <h1>🌱 AI Soil Analysis</h1>
      <p>
        Enter soil and environmental parameters to get crop
        recommendations, soil health insights and AI-powered guidance.
      </p>
    </div>

    <div className="quick-features">
      <div className="quick-card">🤖 ML Prediction</div>
      <div className="quick-card">📊 Soil Analytics</div>
      <div className="quick-card">🌾 Crop Recommendation</div>
    </div>

    <div className="soil-card">
      <form onSubmit={handleSubmit} className="soil-form-grid">

        <div className="input-group">
          <label>🌾 Crop</label>
          <select
            name="crop"
            value={formData.crop}
            onChange={handleChange}
          >
            <option>Rice</option>
            <option>Wheat</option>
            <option>Maize</option>
            <option>Soybean</option>
            <option>Cotton</option>
          </select>
        </div>

        <div className="input-group">
          <label>🧪 Nitrogen (N)</label>
          <input
            type="number"
            name="nitrogen"
            value={formData.nitrogen}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label>🧪 Phosphorus (P)</label>
          <input
            type="number"
            name="phosphorus"
            value={formData.phosphorus}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label>🧪 Potassium (K)</label>
          <input
            type="number"
            name="potassium"
            value={formData.potassium}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label>⚗️ pH</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="14"
            name="ph"
            value={formData.ph}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label>🌧️ Rainfall (mm)</label>
          <input
            type="number"
            name="rainfall"
            value={formData.rainfall}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label>🌡️ Temperature (°C)</label>
          <input
            type="number"
            name="temperature"
            value={formData.temperature}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label>💧 Humidity (%)</label>
          <input
            type="number"
            name="humidity"
            value={formData.humidity}
            onChange={handleChange}
            required
          />
        </div>

        <div className="submit-section">
          <button type="submit" disabled={loading}>
            {loading
              ? "🔍 Analyzing Soil..."
              : "🚀 Analyze Soil"}
          </button>
        </div>

      </form>
    </div>
  </div>
);
}

export default SoilForm;
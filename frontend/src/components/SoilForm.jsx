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
      <div className="soil-card">
        <h1>🌱 Soil Analysis Form</h1>
        <p>Enter your soil details below</p>

        <form onSubmit={handleSubmit}>
          <label>Crop</label>
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

          <label>Nitrogen (N)</label>
          <input
            type="number"
            name="nitrogen"
            value={formData.nitrogen}
            onChange={handleChange}
            required
          />

          <label>Phosphorus (P)</label>
          <input
            type="number"
            name="phosphorus"
            value={formData.phosphorus}
            onChange={handleChange}
            required
          />

          <label>Potassium (K)</label>
          <input
            type="number"
            name="potassium"
            value={formData.potassium}
            onChange={handleChange}
            required
          />

          <label>pH</label>
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

          <label>Rainfall (mm)</label>
          <input
            type="number"
            name="rainfall"
            value={formData.rainfall}
            onChange={handleChange}
            required
          />

          <label>Temperature (°C)</label>
          <input
            type="number"
            name="temperature"
            value={formData.temperature}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Analyzing..." : "Start Soil Analysis"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SoilForm;
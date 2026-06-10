import { useState } from "react";
import { analyzeSoil, compareCrops } from "../services/api";

function SoilForm({
  setView,
  setAnalysis,
  setRankings,
  language,
  setLanguage,
}) {
  const [formData, setFormData] = useState({
    crop: "Rice",
    ph: "",
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    acres: "",
    language: "English",
  });

  const crops = [
    "Rice",
    "Maize",
    "Soybean",
    "Groundnut",
    "Cotton",
    "Sugarcane",
    "Tomato",
    "Potato",
    "Onion",
    "Wheat",
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Analyze soil
      const analysisRes = await analyzeSoil(formData);

      setAnalysis(analysisRes.data);

      // Compare crops
      const rankingRes = await compareCrops({
        ph: Number(formData.ph),
        nitrogen: Number(formData.nitrogen),
        phosphorus: Number(formData.phosphorus),
        potassium: Number(formData.potassium),
      });

      setRankings(rankingRes.data.rankings);

      // Move to dashboard
      setView("results");
    } catch (error) {
      console.error("API Error:", error);
      alert("Backend connection failed.");
    }
  };

  return (
    <div style={{ padding: "30px", maxWidth: "600px", margin: "auto" }}>
      <h1>🌱 AI Soil Health Advisory System</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Crop</label>
          <br />
          <select
            name="crop"
            value={formData.crop}
            onChange={handleChange}
          >
            {crops.map((crop) => (
              <option key={crop} value={crop}>
                {crop}
              </option>
            ))}
          </select>
        </div>

        <br />

        <div>
          <label>pH</label>
          <br />
          <input
            type="number"
            step="0.1"
            name="ph"
            value={formData.ph}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Nitrogen (N)</label>
          <br />
          <input
            type="number"
            name="nitrogen"
            value={formData.nitrogen}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Phosphorus (P)</label>
          <br />
          <input
            type="number"
            name="phosphorus"
            value={formData.phosphorus}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Potassium (K)</label>
          <br />
          <input
            type="number"
            name="potassium"
            value={formData.potassium}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Farm Acres</label>
          <br />
          <input
            type="number"
            name="acres"
            value={formData.acres}
            onChange={handleChange}
          />
        </div>

        <br />

        <div>
          <label>Language</label>
          <br />
          <select
            name="language"
            value={formData.language}
            onChange={(e) => {
              handleChange(e);
              setLanguage(e.target.value);
            }}
          >
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Marathi">Marathi</option>
          </select>
        </div>

        <br />

        <button type="submit">
          Analyze Soil
        </button>
      </form>
    </div>
  );
}

export default SoilForm;
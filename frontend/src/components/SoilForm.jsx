import { useState, useEffect } from "react";
import { analyzeSoil, compareCrops, getCropsList } from "../services/api";
import { translations } from "../services/translations";
import "./SoilForm.css";

function SoilForm({ onResult, language }) {
  const t = translations[language] || translations["English"];
  const [crops, setCrops] = useState([]);
  const [formData, setFormData] = useState({
    crop: "",
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    ph: "",
    rainfall: "",
    temperature: "",
    humidity: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchCrops = async () => {
      try {
        const response = await getCropsList();
        if (isMounted && response.data) {
          setCrops(response.data);
          if (response.data.length > 0) {
            setFormData((prev) => ({
              ...prev,
              crop: response.data[0].id,
            }));
          }
        }
      } catch (err) {
        console.error("Error fetching crops list:", err);
      }
    };
    fetchCrops();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const [listeningField, setListeningField] = useState(null);
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const isSpeechSupported = !!SpeechRecognition;

  const extractNumberFromText = (text) => {
    const match = text.match(/\d+(\.\d+)?/);
    if (match) {
      return match[0];
    }
    const textLower = text.toLowerCase().trim();
    const wordNumbers = {
      zero: "0", one: "1", two: "2", three: "3", four: "4",
      five: "5", six: "6", seven: "7", eight: "8", nine: "9", ten: "10"
    };
    if (wordNumbers[textLower]) {
      return wordNumbers[textLower];
    }
    return null;
  };

  const startSpeechInput = (fieldName) => {
    if (!isSpeechSupported) {
      alert("Speech recognition is not supported in this browser. Please try Google Chrome.");
      return;
    }

    if (listeningField) {
      window._activeFormRecognition?.stop();
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    const localeMap = {
      English: "en-US",
      Hindi: "hi-IN",
      Marathi: "mr-IN",
      Gujarati: "gu-IN",
    };
    recognition.lang = localeMap[language] || "en-US";

    recognition.onstart = () => {
      setListeningField(fieldName);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const extracted = extractNumberFromText(transcript);
      if (extracted !== null) {
        setFormData((prev) => ({
          ...prev,
          [fieldName]: extracted,
        }));
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setListeningField(null);
    };

    recognition.onend = () => {
      setListeningField(null);
    };

    window._activeFormRecognition = recognition;
    recognition.start();
  };

  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherSuccess, setWeatherSuccess] = useState(false);
  const [locationCoords, setLocationCoords] = useState(null);

  const fetchLiveWeather = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setWeatherLoading(true);
    setWeatherSuccess(false);
    setLocationCoords(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocationCoords({ lat: latitude.toFixed(2), lon: longitude.toFixed(2) });

        try {
          // 1. Fetch current Temp & Humidity
          const forecastRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m`
          );
          if (!forecastRes.ok) throw new Error("Forecast API error");
          const forecastData = await forecastRes.json();

          // 2. Fetch last year's Monsoon Rainfall (June 1st to Sept 30)
          const prevYear = new Date().getFullYear() - 1;
          const archiveRes = await fetch(
            `https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${prevYear}-06-01&end_date=${prevYear}-09-30&daily=precipitation_sum`
          );
          if (!archiveRes.ok) throw new Error("Archive API error");
          const archiveData = await archiveRes.json();

          const temp = forecastData.current?.temperature_2m;
          const humidity = forecastData.current?.relative_humidity_2m;
          const precipitationArray = archiveData.daily?.precipitation_sum || [];
          const totalRainfall = precipitationArray.reduce((sum, val) => sum + (val || 0), 0);

          setFormData((prev) => ({
            ...prev,
            temperature: temp !== undefined ? Math.round(temp).toString() : prev.temperature,
            humidity: humidity !== undefined ? Math.round(humidity).toString() : prev.humidity,
            rainfall: totalRainfall > 0 ? Math.round(totalRainfall).toString() : prev.rainfall,
          }));

          setWeatherSuccess(true);
        } catch (error) {
          console.error("Error fetching weather details:", error);
          alert("Failed to retrieve weather metrics. Please fill manually.");
        } finally {
          setWeatherLoading(false);
        }
      },
      (error) => {
        console.error("Location error:", error);
        alert(t.locationError || "Location access denied or unavailable.");
        setWeatherLoading(false);
      },
      { timeout: 10000 }
    );
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

      const analysisResponse = await analyzeSoil({
        ...formData,
        language
      });
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
        <h1>{t.formHeaderTitle}</h1>
        <p>{t.formHeaderSub}</p>
      </div>

      <div className="quick-features">
        <div className="quick-card">🤖 {t.mlBadge.replace("🤖 ", "")}</div>
        <div className="quick-card">📊 {t.analyticsBadge.replace("📊 ", "")}</div>
        <div className="quick-card">🌾 {t.cropBadge.replace("🌾 ", "")}</div>
      </div>

      <div className="soil-card">
        {/* Live Weather Fetch Action Bar */}
        <div className="weather-autofill-bar">
          <button
            type="button"
            className={`btn-fetch-weather ${weatherLoading ? "loading" : ""} ${weatherSuccess ? "success" : ""}`}
            onClick={fetchLiveWeather}
            disabled={weatherLoading}
          >
            {weatherLoading ? t.fetchingWeather : weatherSuccess ? `✔️ ${t.weatherSuccess}` : t.fetchWeatherBtn}
          </button>
          {locationCoords && (
            <span className="location-coords-label">
              {t.locationLabel} {locationCoords.lat}°N, {locationCoords.lon}°E
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit} className="soil-form-grid">

          <div className="input-group">
            <label>{t.formLabelCrop}</label>
            <select
              name="crop"
              value={formData.crop}
              onChange={handleChange}
            >
              {crops.map((c) => (
                <option key={c.id} value={c.id}>
                  {language !== "English" ? c.hindi_name || c.name : c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>{t.formLabelN}</label>
            <div className="input-with-mic">
              <input
                type="number"
                name="nitrogen"
                value={formData.nitrogen}
                onChange={handleChange}
                required
              />
              {isSpeechSupported && (
                <button
                  type="button"
                  className={`form-mic-btn ${listeningField === "nitrogen" ? "active" : ""}`}
                  onClick={() => startSpeechInput("nitrogen")}
                  title={t.micTooltip}
                >
                  {listeningField === "nitrogen" ? "🎙️" : "🎤"}
                </button>
              )}
            </div>
          </div>

          <div className="input-group">
            <label>{t.formLabelP}</label>
            <div className="input-with-mic">
              <input
                type="number"
                name="phosphorus"
                value={formData.phosphorus}
                onChange={handleChange}
                required
              />
              {isSpeechSupported && (
                <button
                  type="button"
                  className={`form-mic-btn ${listeningField === "phosphorus" ? "active" : ""}`}
                  onClick={() => startSpeechInput("phosphorus")}
                  title={t.micTooltip}
                >
                  {listeningField === "phosphorus" ? "🎙️" : "🎤"}
                </button>
              )}
            </div>
          </div>

          <div className="input-group">
            <label>{t.formLabelK}</label>
            <div className="input-with-mic">
              <input
                type="number"
                name="potassium"
                value={formData.potassium}
                onChange={handleChange}
                required
              />
              {isSpeechSupported && (
                <button
                  type="button"
                  className={`form-mic-btn ${listeningField === "potassium" ? "active" : ""}`}
                  onClick={() => startSpeechInput("potassium")}
                  title={t.micTooltip}
                >
                  {listeningField === "potassium" ? "🎙️" : "🎤"}
                </button>
              )}
            </div>
          </div>

          <div className="input-group">
            <label>{t.formLabelPh}</label>
            <div className="input-with-mic">
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
              {isSpeechSupported && (
                <button
                  type="button"
                  className={`form-mic-btn ${listeningField === "ph" ? "active" : ""}`}
                  onClick={() => startSpeechInput("ph")}
                  title={t.micTooltip}
                >
                  {listeningField === "ph" ? "🎙️" : "🎤"}
                </button>
              )}
            </div>
          </div>

          <div className="input-group">
            <label>{t.formLabelRainfall}</label>
            <div className="input-with-mic">
              <input
                type="number"
                name="rainfall"
                value={formData.rainfall}
                onChange={handleChange}
                required
              />
              {isSpeechSupported && (
                <button
                  type="button"
                  className={`form-mic-btn ${listeningField === "rainfall" ? "active" : ""}`}
                  onClick={() => startSpeechInput("rainfall")}
                  title={t.micTooltip}
                >
                  {listeningField === "rainfall" ? "🎙️" : "🎤"}
                </button>
              )}
            </div>
          </div>

          <div className="input-group">
            <label>{t.formLabelTemp}</label>
            <div className="input-with-mic">
              <input
                type="number"
                name="temperature"
                value={formData.temperature}
                onChange={handleChange}
                required
              />
              {isSpeechSupported && (
                <button
                  type="button"
                  className={`form-mic-btn ${listeningField === "temperature" ? "active" : ""}`}
                  onClick={() => startSpeechInput("temperature")}
                  title={t.micTooltip}
                >
                  {listeningField === "temperature" ? "🎙️" : "🎤"}
                </button>
              )}
            </div>
          </div>

          <div className="input-group">
            <label>{t.formLabelHumidity}</label>
            <div className="input-with-mic">
              <input
                type="number"
                name="humidity"
                value={formData.humidity}
                onChange={handleChange}
                required
              />
              {isSpeechSupported && (
                <button
                  type="button"
                  className={`form-mic-btn ${listeningField === "humidity" ? "active" : ""}`}
                  onClick={() => startSpeechInput("humidity")}
                  title={t.micTooltip}
                >
                  {listeningField === "humidity" ? "🎙️" : "🎤"}
                </button>
              )}
            </div>
          </div>

          <div className="submit-section">
            <button type="submit" disabled={loading}>
              {loading ? t.formBtnAnalyzing : t.formBtnAnalyze}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default SoilForm;
import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { translations } from "../services/translations";
import "./HistoryView.css";

function HistoryView({ setView, setAnalysis, setRankings, language }) {
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("soil_history") || "[]");
    } catch (e) {
      console.error("Error reading local storage history:", e);
      return [];
    }
  });
  const t = translations[language] || translations["English"];

  const handleViewReport = (item) => {
    setAnalysis(item.analysis);
    setRankings(item.rankings);
    setView("dashboard");
  };

  const handleDeleteItem = (id) => {
    const updated = history.filter((item) => item.id !== id);
    setHistory(updated);
    localStorage.setItem("soil_history", JSON.stringify(updated));
  };

  const handleClearHistory = () => {
    const confirmMsg =
      language === "Hindi"
        ? "क्या आप सचमुच सारा इतिहास मिटाना चाहते हैं?"
        : language === "Marathi"
        ? "तुम्हाला नक्की इतिहास साफ करायचा आहे का?"
        : language === "Gujarati"
        ? "શું તમે ખરેખર ઇતિહાસ સાફ કરવા માંગો છો?"
        : "Are you sure you want to clear all history?";

    if (window.confirm(confirmMsg)) {
      setHistory([]);
      localStorage.removeItem("soil_history");
    }
  };

  // Compile trend chart data (chronological: oldest to newest)
  const chartData = [...history].reverse().map((item) => ({
    date: item.timestamp.split(",")[0],
    N: item.analysis.N || item.analysis.nitrogen || 0,
    P: item.analysis.P || item.analysis.phosphorus || 0,
    K: item.analysis.K || item.analysis.potassium || 0,
    score: item.analysis.soil_health_score || 0,
  }));

  // Crop translation maps for list
  const cropTranslationMap = {
    "Wheat": { Hindi: "गेहूँ", Marathi: "गेहूँ", Gujarati: "ઘઉં" },
    "Rice": { Hindi: "धान", Marathi: "तांदूळ", Gujarati: "ડાંગર" },
    "Maize": { Hindi: "मक्का", Marathi: "मका", Gujarati: "મકાઈ" },
    "Soybean": { Hindi: "सोयाबीन", Marathi: "सोयाबीन", Gujarati: "સોયાબીન" },
    "Cotton": { Hindi: "कपास", Marathi: "कापूस", Gujarati: "કપાસ" },
    "Groundnut": { Hindi: "मूंगफली", Marathi: "भुईमूग", Gujarati: "મગફળી" },
    "Sugarcane": { Hindi: "गन्ना", Marathi: "ऊस", Gujarati: "શેરડી" },
    "Tomato": { Hindi: "टमाटर", Marathi: "टोमॅटो", Gujarati: "ટોમેટો" },
    "Potato": { Hindi: "आलू", Marathi: "बटाटा", Gujarati: "બટાકા" },
    "Onion": { Hindi: "प्याज", Marathi: "कांदा", Gujarati: "ડુંગળી" },
  };

  const getTranslatedCropName = (cropName) => {
    if (language === "English") return cropName;
    return cropTranslationMap[cropName]?.[language] || cropName;
  };

  return (
    <div className="history-container">
      <div className="history-controls">
        <button className="btn-back" onClick={() => setView("landing")}>
          {t.backToLanding}
        </button>

        {history.length > 0 && (
          <button className="btn-clear-history" onClick={handleClearHistory}>
            {t.clearHistory}
          </button>
        )}
      </div>

      <div className="history-header">
        <h1>{t.historyTitle}</h1>
        <p>{t.historySub}</p>
      </div>

      {history.length > 0 && (
        <div className="trends-panel">
          <h2>📊 {t.trendsTitle}</h2>
          <div style={{ width: "100%", height: 320 }}>
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#40916c"
                  strokeWidth={3}
                  name={t.scoreLabel}
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="N"
                  stroke="#ef4444"
                  strokeWidth={1.5}
                  name="N"
                />
                <Line
                  type="monotone"
                  dataKey="P"
                  stroke="#3b82f6"
                  strokeWidth={1.5}
                  name="P"
                />
                <Line
                  type="monotone"
                  dataKey="K"
                  stroke="#eab308"
                  strokeWidth={1.5}
                  name="K"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="history-list">
        {history.length > 0 ? (
          history.map((item) => (
            <div key={item.id} className="history-card">
              <div className="history-card-header">
                <span className="history-date">📅 {item.timestamp}</span>
                <span className="history-score-badge">
                  {t.scoreLabel}: {item.analysis.soil_health_score}/100
                </span>
              </div>

              <div className="history-card-body">
                <div>
                  <span className="label">{t.cropLabel}</span>
                  <span className="value">
                    {getTranslatedCropName(
                      item.rankings?.[0]?.crop || item.analysis.recommended_crop
                    )}
                  </span>
                </div>
                <div>
                  <span className="label">pH</span>
                  <span className="value">{item.analysis.ph}</span>
                </div>
                <div>
                  <span className="label">N - P - K</span>
                  <span className="value">
                    {item.analysis.N} - {item.analysis.P} - {item.analysis.K}
                  </span>
                </div>
                <div>
                  <span className="label">Status</span>
                  <span className="value">
                    {item.analysis.soil_health_status}
                  </span>
                </div>
              </div>

              <div className="history-card-actions">
                <button
                  className="btn-history-delete"
                  onClick={() => handleDeleteItem(item.id)}
                >
                  🗑️
                </button>
                <button
                  className="btn-history-view"
                  onClick={() => handleViewReport(item)}
                >
                  👁️ {t.viewReport}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-history-placeholder">
            <span style={{ fontSize: "3rem" }}>📭</span>
            <h3>{t.noHistory}</h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default HistoryView;

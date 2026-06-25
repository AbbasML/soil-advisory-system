import { useState } from "react";
import "./App.css";

import LandingPage from "./components/LandingPage";
import SoilForm from "./components/SoilForm";
import Dashboard from "./components/Dashboard";
import Chatbot from "./components/Chatbot";
import LoadingScreen from "./components/LoadingScreen";
import HistoryView from "./components/HistoryView";
import { translations } from "./services/translations";

function App() {
  const [view, setView] = useState("landing");
  const [analysis, setAnalysis] = useState(null);
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("English");

  const handleAnalysisComplete = (analysisData, rankingData) => {
    setLoading(true);

    // Save to history list in LocalStorage
    try {
      const historyItem = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleString(),
        analysis: analysisData,
        rankings: rankingData
      };
      const existingHistory = JSON.parse(localStorage.getItem("soil_history") || "[]");
      const updatedHistory = [historyItem, ...existingHistory];
      localStorage.setItem("soil_history", JSON.stringify(updatedHistory));
    } catch (e) {
      console.error("Failed to save soil history:", e);
    }

    setTimeout(() => {
      setAnalysis(analysisData);
      setRankings(rankingData);
      setView("dashboard");
      setLoading(false);
    }, 2000);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  const t = translations[language] || translations["English"];

  return (
    <div className="app-container">
      {/* Global Navigation Header with Language Selector & History Link */}
      <header className="global-header">
        <div className="logo-section" style={{ cursor: "pointer" }} onClick={() => setView("landing")}>
          <span className="logo-emoji">🌾</span>
          <span className="logo-text">{t.logoText}</span>
        </div>
        
        <div className="header-actions">
          <button
            className="btn-back"
            style={{ marginTop: 0, padding: "8px 16px", background: "rgba(255,255,255,0.9)" }}
            onClick={() => setView("history")}
          >
            {t.navHistory}
          </button>

          <label htmlFor="global-lang-select" className="lang-label">
            {t.langLabel}
          </label>
          
          <select
            id="global-lang-select"
            className="global-lang-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="English">English</option>
            <option value="Hindi">Hindi (हिंदी)</option>
            <option value="Marathi">Marathi (मराठी)</option>
            <option value="Gujarati">Gujarati (ગુજરાતી)</option>
          </select>
        </div>
      </header>

      {view === "landing" && (
        <LandingPage onStart={() => setView("form")} language={language} />
      )}

      {view === "form" && (
        <SoilForm
          setView={setView}
          setAnalysis={setAnalysis}
          setRankings={setRankings}
          onResult={handleAnalysisComplete}
          language={language}
        />
      )}

      {view === "dashboard" && analysis && (
        <Dashboard
          analysis={analysis}
          rankings={rankings}
          setView={setView}
          language={language}
        />
      )}

      {view === "chat" && (
        <Chatbot
          key={language}
          analysis={analysis}
          language={language}
          onLanguageChange={setLanguage}
          setView={setView}
        />
      )}

      {view === "history" && (
        <HistoryView
          setView={setView}
          setAnalysis={setAnalysis}
          setRankings={setRankings}
          language={language}
        />
      )}
    </div>
  );
}

export default App;
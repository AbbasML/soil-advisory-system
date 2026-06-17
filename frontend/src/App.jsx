import { useState } from "react";
import "./App.css";

import LandingPage from "./components/LandingPage";
import SoilForm from "./components/SoilForm";
import Dashboard from "./components/Dashboard";
import Chatbot from "./components/Chatbot";

function App() {
  const [view, setView] = useState("landing");
  const [analysis, setAnalysis] = useState(null);
  const [rankings, setRankings] = useState([]);

  const handleAnalysisComplete = (analysisData, rankingData) => {
    setAnalysis(analysisData);
    setRankings(rankingData);
    setView("dashboard");
  };

  return (
    <div className="app-container">
      {view === "landing" && (
        <LandingPage onStart={() => setView("form")} />
      )}

      {view === "form" && (
  <SoilForm
    setView={setView}
    setAnalysis={setAnalysis}
    setRankings={setRankings}
    onResult={handleAnalysisComplete}
  />
)}

      {view === "dashboard" && analysis && (
        <Dashboard
          analysis={analysis}
          rankings={rankings}
          setView={setView}
        />
      )}

      {view === "chat" && (
  <Chatbot
    analysis={analysis}
    language="English"
    setView={setView}
  />
)}
    </div>
  );
}

export default App;
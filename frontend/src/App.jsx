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

      {/* Landing Page */}
      {view === "landing" && (
        <LandingPage onStart={() => setView("form")} />
      )}

      {/* Soil Form */}
      {view === "form" && (
        <SoilForm
          setView={setView}
          setAnalysis={setAnalysis}
          setRankings={setRankings}
          onResult={handleAnalysisComplete}
        />
      )}

      {/* Dashboard */}
      {view === "dashboard" && analysis && (
        <>
          <Dashboard
            analysis={analysis}
            rankings={rankings}
          />

          <Chatbot />
        </>
      )}
    </div>
  );
}

export default App;
import { useState } from "react";
import "./App.css";

import LandingPage from "./components/LandingPage";
import SoilForm from "./components/SoilForm";
import Dashboard from "./components/Dashboard";
import Chatbot from "./components/Chatbot";
import LoadingScreen from "./components/LoadingScreen";
function App() {
  const [view, setView] = useState("landing");
  const [analysis, setAnalysis] = useState(null);
  const [rankings, setRankings] = useState([]);

  const handleAnalysisComplete = (analysisData, rankingData) => {
  setLoading(true);

  setTimeout(() => {
    setAnalysis(analysisData);
    setRankings(rankingData);
    setView("dashboard");
    setLoading(false);
  }, 2000);
};
  const [loading, setLoading] = useState(false);
  if (loading) {
  return <LoadingScreen />;
}
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
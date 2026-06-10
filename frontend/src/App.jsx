import { useState } from "react";
import SoilForm from "./components/SoilForm";
import Dashboard from "./components/Dashboard";
import Chatbot from "./components/Chatbot";

function App() {
  const [view, setView] = useState("form");
  const [analysis, setAnalysis] = useState(null);
  const [rankings, setRankings] = useState([]);
  const [language, setLanguage] = useState("English");

  return (
    <div>
      {view === "form" && (
        <SoilForm
          setView={setView}
          setAnalysis={setAnalysis}
          setRankings={setRankings}
          language={language}
          setLanguage={setLanguage}
        />
      )}

      {view === "results" && (
        <Dashboard
  analysis={analysis}
  rankings={rankings}
  setView={setView}
/>
      )}

      {view === "chat" && (
        <Chatbot
          analysis={analysis}
          language={language}
          setView={setView}
        />
      )}
    </div>
  );
}

export default App;
import { useState, useEffect } from "react";
import { translations } from "../services/translations";

const AISummaryCard = ({ summary, language }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const t = translations[language] || translations["English"];

  // Stop speaking when component unmounts
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSpeak = () => {
    if (!window.speechSynthesis) {
      alert("Text-to-Speech is not supported in this browser.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const textToSpeak = summary || "No AI analysis available.";
      const utterance = new SpeechSynthesisUtterance(textToSpeak);

      const localeMap = {
        English: "en-US",
        Hindi: "hi-IN",
        Marathi: "mr-IN",
        Gujarati: "gu-IN",
      };
      utterance.lang = localeMap[language] || "en-US";

      // Try to find matching voice
      const voices = window.speechSynthesis.getVoices();
      const matchingVoice = voices.find((v) =>
        v.lang.toLowerCase().startsWith(utterance.lang.toLowerCase().substring(0, 2))
      );
      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = (e) => {
        console.error("SpeechSynthesis error:", e);
        setIsSpeaking(false);
      };

      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="card" style={{ position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
        <h2 style={{ margin: 0 }}>🤖 {t.dashAiSummary || "AI Agricultural Advisory Summary"}</h2>
        {summary && (
          <button
            onClick={handleSpeak}
            style={{
              background: isSpeaking ? "#ef4444" : "#16a34a",
              color: "white",
              border: "none",
              borderRadius: "20px",
              padding: "8px 16px",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              transition: "all 0.2s ease"
            }}
          >
            {isSpeaking ? t.stopSpeaking : t.speakAdvisory}
          </button>
        )}
      </div>

      <div
        style={{
          background: "#f0fdf4",
          borderLeft: "6px solid #16a34a",
          borderRadius: "12px",
          padding: "18px",
          marginTop: "12px",
          lineHeight: "1.8",
          color: "#1f2937",
          fontSize: "15px",
        }}
      >
        {summary || "No AI analysis available."}
      </div>

      <p
        style={{
          marginTop: "15px",
          fontSize: "13px",
          color: "#6b7280",
          textAlign: "center",
        }}
      >
        Generated using Google Gemini AI and soil nutrient analysis.
      </p>
    </div>
  );
};

export default AISummaryCard;
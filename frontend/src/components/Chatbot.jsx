import { useState, useEffect, useRef, useCallback } from "react";
import { chatWithBot } from "../services/api";
import { translations } from "../services/translations";
import "./Chatbot.css";

function Chatbot({ analysis, language, onLanguageChange, setView }) {
  const [autoTts, setAutoTts] = useState(true);
  
  const getGreeting = useCallback((selectedLang) => {
    const cropName = analysis?.recommended_crop || analysis?.crop || "N/A";
    const healthScore = analysis?.soil_health_score || "N/A";
    
    switch (selectedLang) {
      case "Hindi":
        return `नमस्ते! मैं किसानबॉट हूँ 🌾। आपके वर्तमान मिट्टी का स्वास्थ्य स्कोर ${healthScore}/100 है और अनुशंसित फसल ${cropName} है। मुझसे अपनी मिट्टी और फसलों के बारे में कुछ भी पूछें।`;
      case "Marathi":
        return `नमस्ते! मी किसानबॉट आहे 🌾. आपल्या मातीचे आरोग्य स्कोर ${healthScore}/100 आहे आणि शिफारस केलेले पीक ${cropName} आहे. मला आपल्या माती आणि पिकांबद्दल काहीही विचारा.`;
      case "Gujarati":
        return `નમસ્તે! હું કિસાનબોટ છું 🌾. તમારી જમીનનું સ્વાસ્થ્ય સ્કોર ${healthScore}/100 છે અને ભલામણ કરેલ પાક ${cropName} છે. મને તમારી જમીન અને પાક વિશે કંઈ પણ પૂછો.`;
      default:
        return `Namaste! I am KisanBot 🌾. Your current soil health score is ${healthScore}/100 and the recommended crop is ${cropName}. Ask me anything about your soil and crops.`;
    }
  }, [analysis]);

  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: getGreeting(language),
    },
  ]);

  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const chatHistoryRef = useRef(null);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const isSpeechSupported = !!SpeechRecognition;

  // Auto-scroll chat window when new message arrives
  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [messages]);

  // Stop speaking when component unmounts
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speakText = useCallback((text, languageCode) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const localeMap = {
      English: "en-US",
      Hindi: "hi-IN",
      Marathi: "mr-IN",
      Gujarati: "gu-IN",
    };
    utterance.lang = localeMap[languageCode] || "en-US";

    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find((v) =>
      v.lang.toLowerCase().startsWith(utterance.lang.toLowerCase().substring(0, 2))
    );
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    window.speechSynthesis.speak(utterance);
  }, []);

  const quickQuestions = {
    English: [
      "When should I sow?",
      "Best crop for my soil?",
      "How can I improve nitrogen?",
      "Recommended fertilizer?",
    ],
    Hindi: [
      "बुवाई कब करनी चाहिए?",
      "मेरी मिट्टी के लिए सबसे अच्छी फसल?",
      "नाइट्रोजन कैसे बढ़ाएं?",
      "कौन सा उर्वरक डालें?",
    ],
    Marathi: [
      "पेरणी कधी करावी?",
      "माझ्या मातीसाठी सर्वोत्तम पीक कोणते?",
      "नायट्रोजन कसे वाढवायचे?",
      "खतांची शिफारस काय आहे?",
    ],
    Gujarati: [
      "વાવણી ક્યારે કરવી?",
      "મારી જમીન માટે શ્રેષ્ઠ પાક કયો?",
      "નાઇટ્રોજન કેવી રીતે વધારવો?",
      "કયું ખાતર વાપરવું?",
    ],
  };

  const currentQuickQs = quickQuestions[language] || quickQuestions["English"];

  const toggleListening = () => {
    if (!isSpeechSupported) {
      alert("Speech recognition is not supported in this browser. Please try Google Chrome.");
      return;
    }

    if (isListening) {
      window._activeRecognition?.stop();
      setIsListening(false);
    } else {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
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
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      window._activeRecognition = recognition;
      recognition.start();
    }
  };

  const sendMessage = async (messageText = input) => {
    if (!messageText.trim()) return;

    const userMessage = {
      role: "user",
      text: messageText,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const res = await chatWithBot({
        message: messageText,
        language: language,
        soil_context: JSON.stringify(analysis),
      });

      const botMessage = {
        role: "bot",
        text:
          res.data.reply ||
          res.data.error ||
          "KisanBot could not generate a response.",
      };

      setMessages((prev) => [...prev, botMessage]);

      if (autoTts) {
        speakText(botMessage.text, language);
      }
    } catch (error) {
      console.error("Chat Error:", error);
      const errorText = error.response?.data?.error || "Unable to contact KisanBot.";
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: errorText,
        },
      ]);
      if (autoTts) {
        speakText(errorText, language);
      }
    }
  };

  const t = translations[language] || translations["English"];

  return (
    <div className="chatbot-container">
      <div className="chatbot-header-row">
        <div>
          <button className="back-btn" onClick={() => setView("dashboard")}>
            ← Back to Dashboard
          </button>
        </div>
        
        <div className="language-selector-wrap">
          <label htmlFor="bot-lang-select" style={{ fontWeight: 600, color: "#2d6a4f" }}>🗣️ Select Language:</label>
          <select
            id="bot-lang-select"
            className="language-select"
            value={language}
            onChange={(e) => {
              const selected = e.target.value;
              if (onLanguageChange) {
                onLanguageChange(selected);
              }
              if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
              }
              setMessages([
                {
                  role: "bot",
                  text: getGreeting(selected),
                },
              ]);
            }}
          >
            <option value="English">English</option>
            <option value="Hindi">Hindi (हिंदी)</option>
            <option value="Marathi">Marathi (मराठी)</option>
            <option value="Gujarati">Gujarati (ગુજરાતી)</option>
          </select>

          {window.speechSynthesis && (
            <button
              type="button"
              onClick={() => {
                const nextVal = !autoTts;
                setAutoTts(nextVal);
                if (!nextVal && window.speechSynthesis) {
                  window.speechSynthesis.cancel();
                }
              }}
              style={{
                background: autoTts ? "#2d6a4f" : "#6b7280",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "8px 16px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                marginLeft: "10px"
              }}
            >
              {autoTts ? t.ttsToggleOn : t.ttsToggleOff}
            </button>
          )}
        </div>
      </div>

      <div style={{ textAlign: "center", margin: "10px 0" }}>
        <h1 style={{ color: "#2d6a4f", margin: "0 0 5px 0" }}>🤖 KisanBot Assistant</h1>
        <p style={{ margin: 0, color: "#666" }}>AI-powered agricultural guidance based on your soil report</p>
      </div>

      <div>
        <div className="quick-questions-container">
          {currentQuickQs.map((q) => (
            <button
              key={q}
              className="quick-q-btn"
              onClick={() => {
                if (window.speechSynthesis) {
                  window.speechSynthesis.cancel();
                }
                sendMessage(q);
              }}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      <div className="chat-history" ref={chatHistoryRef}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-message-row ${msg.role}`}
          >
            <div className="message-bubble">
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div className="chat-input-row">
        <input
          type="text"
          className="message-text-input"
          placeholder={language === "Hindi" ? "किसानबॉट से पूछें..." : language === "Marathi" ? "किसानबॉटला विचारा..." : language === "Gujarati" ? "કિસાનબોટને પૂછો..." : "Ask KisanBot..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
              }
              sendMessage();
            }
          }}
        />

        {isSpeechSupported && (
          <button
            type="button"
            className={`mic-btn ${isListening ? "active" : ""}`}
            onClick={toggleListening}
            title={t.voiceListening}
          >
            🎙️
          </button>
        )}

        <button
          className="chat-control-btn"
          onClick={() => {
            if (window.speechSynthesis) {
              window.speechSynthesis.cancel();
            }
            sendMessage();
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chatbot;
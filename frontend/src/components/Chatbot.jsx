import { useState } from "react";
import { chatWithBot } from "../services/api";

function Chatbot({ analysis, language, setView }) {
  const [messages, setMessages] = useState([
    {
  role: "bot",
  text: `Namaste! I am KisanBot 🌾. Your current soil health score is ${analysis?.soil_health_score || "N/A"} and the recommended crop is ${analysis?.crop || "N/A"}. Ask me anything about your soil and crops.`,
},
  ]);

  const [input, setInput] = useState("");

  const quickQuestions = [
    "When should I sow?",
    "Best crop for my soil?",
    "How can I improve nitrogen?",
    "Recommended fertilizer?",
  ];

  const sendMessage = async (messageText = input) => {
    if (!messageText.trim()) return;

    const userMessage = {
      role: "user",
      text: messageText,
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await chatWithBot({
        message: messageText,
        language,
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
    } catch (error) {
  console.error("Chat Error:", error);

  setMessages((prev) => [
    ...prev,
    {
      role: "bot",
      text: error.response?.data?.error || "Unable to contact KisanBot."
    }
  ]);
}

    setInput("");
  };

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "auto",
        padding: "20px",
      }}
    >
      <div className="dashboard-header">
  <h1>🤖 KisanBot Assistant</h1>
  <p>AI-powered farming guidance based on your soil report</p>
</div>

      <button onClick={() => setView("dashboard")}>
  ← Back to Dashboard
</button>

      <br />
      <br />

      <div>
        {quickQuestions.map((q) => (
          <button
            key={q}
            onClick={() => sendMessage(q)}
            style={{
              margin: "5px",
              padding: "8px",
            }}
          >
            {q}
          </button>
        ))}
      </div>

      <br />

      <div
        style={{
          height: "400px",
          overflowY: "auto",
          border: "1px solid #ddd",
          padding: "15px",
          borderRadius: "10px",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign:
                msg.role === "user"
                  ? "right"
                  : "left",
              marginBottom: "15px",
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "10px",
                borderRadius: "10px",
                background:
                  msg.role === "user"
                    ? "#d1e7dd"
                    : "#f1f1f1",
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      <br />

      <input
  type="text"
  placeholder="Ask KisanBot..."
  value={input}
  onChange={(e) => setInput(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  }}
  style={{
    width: "75%",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #ddd",
  }}
/>

      <button
        onClick={() => sendMessage()}
        style={{
          marginLeft: "10px",
          padding: "10px 20px",
        }}
      >
        Send
      </button>
    </div>
  );
}

export default Chatbot;
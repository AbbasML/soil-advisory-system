import { useState } from "react";
import { chatWithBot } from "../services/api";

function Chatbot({ analysis, language, setView }) {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Namaste! I am KisanBot. Ask me anything about your soil and crops.",
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
  text: res.data.reply,
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
      <h1>🌾 KisanBot</h1>

      <button onClick={() => setView("results")}>
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
        onChange={(e) =>
          setInput(e.target.value)
        }
        style={{
          width: "75%",
          padding: "10px",
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
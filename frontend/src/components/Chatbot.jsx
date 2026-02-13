import { useState, useEffect, useRef } from "react";
import client from "../api/client.js";

const initialMessages = [
  {
    from: "AI",
    text: "Hello! I'm Agriseva Assistant. Ask me about crop prices, weather, farming calendar, soil advice, mandi rates, transport, or anything farming-related!"
  }
];

export default function Chatbot() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const addMessage = (from, text) => {
    setMessages((prev) => [...prev, { from, text }]);
  };

  const speak = (text) => {
    if (!window.speechSynthesis) {
      return;
    }
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-IN";
    speech.rate = 0.9;
    window.speechSynthesis.speak(speech);
  };

  const sendMessage = async () => {
    const userText = input.trim();
    if (!userText || loading) {
      return;
    }

    // Add user message
    addMessage("You", userText);
    setInput("");
    setLoading(true);

    try {
      // Special handling for weather queries (optional - can be removed if you want all through chatbot API)
      const lower = userText.toLowerCase();
      let reply = "";

      if ((lower.includes("weather") || lower.includes("rain")) && lower.includes("in")) {
        // Extract city from message
        const cityMatch = userText.match(/in\s+([a-zA-Z\s]+)/i);
        const city = cityMatch && cityMatch[1] ? cityMatch[1].trim() : "Maharashtra";
        
        try {
          const weatherRes = await client.get("/weather/current", {
            params: { region: city }
          });
          const weather = weatherRes.data;
          if (weather.rainfall_mm > 0) {
            reply = `Weather in ${city}: ${weather.temp_c}°C, ${weather.humidity}% humidity, ${weather.rainfall_mm}mm rainfall. Rain expected - transport may be difficult. Consider delaying crop sale.`;
          } else {
            reply = `Weather in ${city}: ${weather.temp_c}°C, ${weather.humidity}% humidity. Weather is clear - selling crops today is suitable.`;
          }
        } catch {
          // Fall through to chatbot API
          const response = await client.post("/chatbot", { message: userText });
          reply = response.data.reply || "Sorry, I couldn't get weather information.";
        }
      } else {
        // Use chatbot API for all other queries
        const response = await client.post("/chatbot", { message: userText });
        reply = response.data.reply || "Sorry, I couldn't process your request.";
      }

      addMessage("AI", reply);
      speak(reply);
    } catch (error) {
      console.error("Chatbot error:", error);
      const fallback = error.response?.data?.detail 
        ? `Error: ${error.response.data.detail}` 
        : "Sorry, I couldn't reach the assistant service. Please check your connection and try again.";
      addMessage("AI", fallback);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const startVoice = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      addMessage("AI", "Voice input is not supported in this browser. Please type your message.");
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onstart = () => {
      addMessage("AI", "🎤 Listening... Speak now.");
    };
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setTimeout(() => {
        sendMessage();
      }, 100);
    };
    
    recognition.onerror = (event) => {
      addMessage("AI", `Voice recognition error: ${event.error}. Please type your message.`);
    };
    
    recognition.onend = () => {
      // Recognition ended
    };
    
    recognition.start();
  };

  return (
    <div className={`chatbot ${open ? "open" : "closed"}`}>
      <div className="chatbot-header">
        <span>🌾 Agriseva Assistant</span>
        <button
          type="button"
          className="chatbot-toggle"
          onClick={() => setOpen((prev) => !prev)}
          aria-label={open ? "Close chatbot" : "Open chatbot"}
        >
          {open ? "–" : "+"}
        </button>
      </div>

      {open && (
        <>
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <p key={index} className={`chatbot-msg ${msg.from.toLowerCase()}`}>
                <b>{msg.from}:</b> {msg.text}
              </p>
            ))}
            {loading && (
              <p className="chatbot-msg ai">
                <b>AI:</b> <span style={{ opacity: 0.7 }}>Thinking...</span>
              </p>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div style={{ display: "flex", gap: "8px", padding: "8px" }}>
            <input
              ref={inputRef}
              className="chatbot-input"
              placeholder="Ask here... (Press Enter to send)"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <button 
              className="btn chatbot-btn" 
              type="button" 
              onClick={sendMessage}
              disabled={loading || !input.trim()}
            >
              {loading ? "..." : "Send"}
            </button>
            <button 
              className="btn chatbot-btn secondary" 
              type="button" 
              onClick={startVoice}
              disabled={loading}
              title="Voice input"
            >
              🎤
            </button>
          </div>
        </>
      )}
    </div>
  );
}

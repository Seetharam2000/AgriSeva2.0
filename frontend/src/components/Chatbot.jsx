import { useState } from "react";
import client from "../api/client.js";

const initialMessages = [
  {
    from: "AI",
    text: "Hello! Ask me about selling crops or market timing."
  }
];

export default function Chatbot() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(true);

  const addMessage = (from, text) => {
    setMessages((prev) => [...prev, { from, text }]);
  };

  const speak = (text) => {
    if (!window.speechSynthesis) {
      return;
    }
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-IN";
    window.speechSynthesis.speak(speech);
  };

  const extractCity = (text) => {
    const match = text.match(/in\s+([a-zA-Z\s]+)/i);
    if (match && match[1]) {
      return match[1].trim();
    }
    return "Kanchipuram";
  };

  const sendMessage = async () => {
    if (!input.trim()) {
      return;
    }
    const userText = input;
    addMessage("You", userText);
    setInput("");
    try {
      const lower = userText.toLowerCase();
      let reply = "";

      if (lower.includes("weather") || lower.includes("rain")) {
        const city = extractCity(userText);
        const weatherRes = await client.get("/weather/current", {
          params: { region: city }
        });
        const weather = weatherRes.data;
        if (weather.rainfall_mm > 0) {
          reply =
            "Rain is expected. Transport may be difficult. Consider delaying crop sale.";
        } else {
          reply = "Weather is clear. Selling crops today is suitable.";
        }
      } else {
        const response = await client.post("/chatbot", { message: userText });
        reply = response.data.reply;
      }

      addMessage("AI", reply);
      speak(reply);
    } catch (error) {
      const fallback = "Sorry, I could not reach the assistant service.";
      addMessage("AI", fallback);
      speak(fallback);
    }
  };

  const startVoice = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      addMessage("AI", "Voice input is not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setTimeout(() => {
        sendMessage();
      }, 0);
    };
    recognition.start();
  };

  return (
    <div className={`chatbot ${open ? "open" : "closed"}`}>
      <div className="chatbot-header">
        <span>🌾 WhenToSell</span>
        <button
          type="button"
          className="chatbot-toggle"
          onClick={() => setOpen((prev) => !prev)}
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
          </div>

          <input
            className="chatbot-input"
            placeholder="Ask here..."
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                sendMessage();
              }
            }}
          />
          <button className="btn chatbot-btn" type="button" onClick={sendMessage}>
            Send
          </button>
          <button className="btn chatbot-btn secondary" type="button" onClick={startVoice}>
            🎤 Speak
          </button>
        </>
      )}
    </div>
  );
}

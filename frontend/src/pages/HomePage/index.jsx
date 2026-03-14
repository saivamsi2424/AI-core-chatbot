import { useEffect, useState, useRef } from "react";
import {
  FiMic,
  FiSend,
  FiZap,
  FiSun,
  FiMoon,
  FiTrash2,
  FiStopCircle,
} from "react-icons/fi";
import axios from "axios";
import "./index.css";

const TypingEffect = ({ text }) => {
  const [displayedText, setDisplayedText] = useState("");
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(timer);
    }, 10);
    return () => clearInterval(timer);
  }, [text]);
  return <span>{displayedText}</span>;
};

function HomePage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  // 1. Voice Recognition Setup
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  if (recognition) {
    recognition.continuous = false;
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
  }

  const startListening = () => {
    if (!recognition)
      return alert("Speech recognition not supported in this browser.");
    setIsListening(true);
    recognition.start();
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = { role: "user", text: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // Sending full history for "Conversational Mind"
      const response = await axios.post("http://localhost:5000/api/chat", {
        message: input,
        history: messages, // Send existing chat history
      });

      setMessages([
        ...newMessages,
        { role: "ai", text: response.data.reply, isNew: true },
      ]);
    } catch (error) {
      setMessages([
        ...newMessages,
        { role: "ai", text: "⚠️ Error connecting to AI." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`app-container ${darkMode ? "dark" : "light"}`}>
      <div className="chat-full-screen">
        <header className="header">
          <div className="brand">
            <FiZap className="zap" /> <span>AI CORE</span>
          </div>
          <div className="actions">
            <button className="nav-btn" onClick={() => setMessages([])}>
              <FiTrash2 />
            </button>
            <button className="nav-btn" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <FiSun /> : <FiMoon />}
            </button>
          </div>
        </header>

        <div className="chat-body">
          {messages.length === 0 ? (
            <div className="hero-section">
              <h1>How can I help you?</h1>
            </div>
          ) : (
            messages.map((m, i) => (
              <div key={i} className={`message-row ${m.role}`}>
                <div className="bubble">
                  {m.role === "ai" && m.isNew ? (
                    <TypingEffect text={m.text} />
                  ) : (
                    m.text
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <footer className="footer">
          <div className="input-pill-wrapper">
            <form className="input-pill" onSubmit={handleSubmit}>
              <button
                type="button"
                className={`pill-btn mic ${isListening ? "active-mic" : ""}`}
                onClick={startListening}
              >
                {isListening ? (
                  <FiStopCircle size={20} color="red" />
                ) : (
                  <FiMic size={20} />
                )}
              </button>
              <input
                type="text"
                placeholder={isListening ? "Listening..." : "Type a message..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                type="submit"
                className="pill-btn send"
                disabled={!input.trim() || loading}
              >
                <FiSend size={20} />
              </button>
            </form>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default HomePage;

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const PHONE_WIDTH = 390;  // iPhone 13 Pro width in px
const PHONE_HEIGHT = 844; // iPhone 13 Pro height in px

function App() {
  const [input, setInput] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const chatContainerRef = useRef(null);

  // Auto scroll on new messages
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatLog]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    setChatLog((prev) => [...prev, { sender: "user", text: input }]);

    try {
      const res = await axios.post("http://localhost:3001/api/chat", {
        message: input,
      });

      setChatLog((prev) => [...prev, { sender: "bot", text: res.data.reply }]);
      setInput("");
    } catch (error) {
      console.error("Axios error:", error);
      setChatLog((prev) => [...prev, { sender: "bot", text: "Server error 😞" }]);
    }
  };

  return (
    <div
      className="flex items-center justify-center bg-pink-100 min-h-screen"
      style={{ minHeight: "100vh" }}
    >
      {/* Phone frame container */}
      <div
        className="bg-white rounded-3xl shadow-2xl flex flex-col"
        style={{
          width: PHONE_WIDTH,
          height: PHONE_HEIGHT,
          border: "10px solid #f87171",
          boxSizing: "content-box",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        {/* Header */}
        <header className="bg-pink-600 text-white text-center py-3 rounded-t-3xl font-bold text-xl select-none">
          💖 Anjali Chat
        </header>

        {/* Chat messages container */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-3"
          style={{ backgroundColor: "#fff0f6" }}
        >
          {chatLog.length === 0 && (
            <p className="text-center text-pink-400 mt-10 select-none">
              Start chatting with Anjali! 💕
            </p>
          )}

          {chatLog.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] px-4 py-2 rounded-lg whitespace-pre-wrap break-words
                  ${
                    msg.sender === "user"
                      ? "bg-pink-500 text-white rounded-br-none"
                      : "bg-pink-200 text-pink-900 rounded-bl-none"
                  }`}
                style={{ wordBreak: "break-word" }}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input area fixed at bottom */}
        <form
          onSubmit={handleSubmit}
          className="flex gap-3 p-4 border-t border-pink-300 bg-pink-50 rounded-b-3xl"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow rounded-full border border-pink-400 px-4 py-3 text-pink-900 placeholder-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
            autoComplete="off"
          />
          <button
            type="submit"
            className="bg-pink-600 hover:bg-pink-700 text-white rounded-full px-6 py-3 font-semibold transition select-none"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;

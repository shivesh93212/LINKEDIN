import React, { useState, useRef, useEffect } from "react";
import { chatBotApi } from "../api/chatBotApi";
import { useNavigate } from "react-router-dom";

export default function ChatBot() {
  const bottomRef = useRef(null);
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const userMsg = message;

    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setMessage("");
    setLoading(true);

    try {
      const data = await chatBotApi(userMsg);

      setMessages((prev) => [
        ...prev,
        { role: "ai", text: data.response },
      ]);
    } catch (err) {
      console.log(err);
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Something went wrong. Try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">

      {/* HEADER */}
      <div className="flex items-center gap-3 bg-gray-700 text-white px-4 py-3 shadow">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-600 px-3 py-1 rounded hover:bg-gray-500 text-sm"
        >
          ← Back
        </button>

        <h2 className="font-semibold text-base sm:text-lg">
          AI ChatBot
        </h2>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 space-y-3">

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-2xl shadow text-sm sm:text-base max-w-[80%] sm:max-w-[60%] break-words
              ${
                msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-800"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* typing indicator */}
        {loading && (
          <div className="text-sm text-gray-500">
            typing...
          </div>
        )}

        <div ref={bottomRef}></div>
      </div>

      {/* INPUT */}
      <div className="sticky bottom-0 bg-white border-t px-3 sm:px-6 py-3 flex gap-2">

        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Ask anything..."
          className="flex-1 border rounded-full px-4 py-2 text-sm sm:text-base outline-none"
        />

        <button
          onClick={sendMessage}
          disabled={loading || !message.trim()}
          className="bg-blue-600 text-white px-4 sm:px-5 rounded-full hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
import React, { useState, useRef, useEffect } from "react";
import { Menu, Plus } from "lucide-react";
import BotPNG from "./chatbox.png";

/* =======================
   BOT PNG COMPONENT
======================= */
const BotPNGIcon = ({ mood = "idle", size = 64 }) => {
  const moodClass =
    mood === "thinking"
      ? "animate-bounce"
      : mood === "happy"
      ? "animate-[pulse_1.2s_ease-in-out_1]"
      : "";

  return (
    <div
      className={`relative flex flex-col items-center ${moodClass}`}
      style={{ width: size }}
    >
      <img
        src={BotPNG}
        alt="AI Bot"
        className="w-full h-auto select-none"
        draggable={false}
      />

      {/* Thinking dots */}
      {mood === "thinking" && (
        <div className="flex gap-1 mt-1">
          <span className="w-2 h-2 bg-pastel-pinkDeep rounded-full animate-bounce" />
          <span className="w-2 h-2 bg-pastel-pinkDeep rounded-full animate-bounce delay-150" />
          <span className="w-2 h-2 bg-pastel-pinkDeep rounded-full animate-bounce delay-300" />
        </div>
      )}
    </div>
  );
};

/* =======================
        CHATBOT
======================= */

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      text: "Hi 👋 I’m your AI Career Assistant. Ask me about majors, universities, or career paths.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [botMood, setBotMood] = useState("happy");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), type: "user", text: input },
    ]);
    setInput("");
    setBotMood("thinking");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          type: "bot",
          text:
            "Thanks for your question 🌸 I’ll help you explore suitable career options.",
        },
      ]);
      setBotMood("happy");
    }, 900);
  };

  return (
    <div className="h-screen flex bg-silver-100">
      {/* ================= Sidebar ================= */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-0"
        } transition-all duration-300 overflow-hidden
        bg-silver-50 border-r border-silver-200`}
      >
        <div className="p-4 border-b border-silver-200">
          <button
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl
            bg-pastel-pinkLight text-slate-700
            hover:bg-pastel-pink transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New chat
          </button>
        </div>

        <div className="absolute bottom-0 w-full p-4 border-t border-silver-200">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <img src={BotPNG} alt="AI" className="w-7 h-7" />
            AI Assistant v1.0
          </div>
        </div>
      </aside>

      {/* ================= Main ================= */}
      <main className="flex-1 flex flex-col relative">
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="absolute top-4 left-4 z-10 p-2 rounded-lg
            bg-silver-50 border border-silver-200 shadow-sm"
          >
            <Menu className="w-4 h-4 text-slate-600" />
          </button>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${
                  msg.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.type === "bot" && (
                  <BotPNGIcon mood={botMood} size={64} />
                )}

                <div
                  className={`px-5 py-3 rounded-2xl max-w-[78%] text-sm md:text-base
                  ${
                    msg.type === "user"
                      ? "bg-indigo-500 text-white shadow-md"
                      : "bg-pastel-pinkLight text-slate-700 border border-pastel-pink"
                  }`}
                >
                  {msg.text}
                </div>

                {msg.type === "user" && (
                  <div className="w-10 h-10 rounded-full bg-silver-200 flex items-center justify-center text-slate-600 text-sm">
                    You
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-silver-200 bg-silver-50 px-4 py-4">
          <form
            onSubmit={handleSend}
            className="max-w-3xl mx-auto flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about your future..."
              className="flex-1 px-5 py-3 rounded-full
              bg-silver-100 border border-silver-200
              focus:outline-none focus:ring-2 focus:ring-pastel-pinkDeep/40"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="px-6 py-3 rounded-full
              bg-pastel-pinkDeep text-white
              shadow-md hover:shadow-[0_0_14px_rgba(255,182,193,0.9)]
              active:scale-95 transition disabled:opacity-40"
            >
              Send
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-2">
            AI may generate incorrect information. Please verify important
            details.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Chatbot;

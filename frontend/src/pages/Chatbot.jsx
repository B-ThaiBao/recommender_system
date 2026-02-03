import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Menu, Plus, Moon, Sun } from "lucide-react";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      text: "Hi 👋 I'm your AI Career Assistant. Ask me about majors, universities, or career paths!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), type: "user", text: input },
    ]);
    setInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          type: "bot",
          text: "I'm thinking about your question 🤔 (demo response)",
        },
      ]);
    }, 800);
  };

  return (
    <div className="h-screen flex bg-slate-100 dark:bg-slate-900 transition-colors">
      {/* ================= Sidebar ================= */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-0"
        } transition-all overflow-hidden
        bg-white/70 dark:bg-slate-800/80
        backdrop-blur-xl border-r border-white/40 dark:border-slate-700`}
      >
        <div className="p-4 border-b border-white/40 dark:border-slate-700 flex justify-between items-center">
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl
            bg-white/80 dark:bg-slate-700
            text-slate-700 dark:text-slate-200 shadow-sm">
            <Plus className="w-4 h-4" />
            New chat
          </button>

          {/* Dark toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-white/70 dark:bg-slate-700"
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-yellow-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>
        </div>

        <div className="p-4 space-y-2">
          <p className="text-xs uppercase tracking-wider text-slate-400">
            Recent
          </p>
          <button className="w-full text-left px-3 py-2 rounded-lg
            text-slate-600 dark:text-slate-300
            hover:bg-white/60 dark:hover:bg-slate-700">
            Career in AI
          </button>
        </div>

        <div className="absolute bottom-0 w-full p-4 border-t border-white/40 dark:border-slate-700">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Bot className="w-4 h-4 text-indigo-400" />
            AI Assistant v1.0
          </div>
        </div>
      </aside>

      {/* ================= Main ================= */}
      <main className="flex-1 flex flex-col relative">
        {/* Mobile menu */}
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="absolute top-4 left-4 z-10 p-2 rounded-lg
            bg-white/80 dark:bg-slate-800 border border-white/40 dark:border-slate-700"
          >
            <Menu className="w-4 h-4 text-slate-600 dark:text-slate-300" />
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
                  <div className="w-9 h-9 rounded-full flex items-center justify-center
                    bg-gradient-to-br from-indigo-500 to-cyan-500 shadow-lg">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}

                <div
                  className={`px-5 py-3 rounded-2xl max-w-[78%]
                    ${
                      msg.type === "user"
                        ? "bg-indigo-600 text-white shadow-lg"
                        : "bg-white/80 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-white/40 dark:border-slate-700"
                    }`}
                >
                  <p className="text-sm md:text-base leading-relaxed">
                    {msg.text}
                  </p>
                </div>

                {msg.type === "user" && (
                  <div className="w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-700
                    flex items-center justify-center">
                    <User className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* ================= Input ================= */}
        <div className="border-t border-white/40 dark:border-slate-700
          bg-white/70 dark:bg-slate-800 backdrop-blur-xl px-4 py-4">
          <form
            onSubmit={handleSend}
            className="max-w-3xl mx-auto relative"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="w-full pl-6 pr-16 py-4 rounded-2xl
                bg-white/80 dark:bg-slate-700
                text-slate-800 dark:text-slate-100
                placeholder-slate-400 dark:placeholder-slate-400
                shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2
                p-3 rounded-xl bg-indigo-600 text-white
                hover:bg-indigo-700 active:scale-95
                shadow-lg disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-2">
            AI may generate incorrect information. Please verify important details.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Chatbot;

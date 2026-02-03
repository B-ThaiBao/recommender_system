import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Menu, Plus } from 'lucide-react';

const Chatbot = () => {
    const [messages, setMessages] = useState([
        { id: 1, type: 'bot', text: 'Hello! I am your AI Career Assistant. How can I help you today? You can ask about universities, career paths, or take a personality quiz.' }
    ]);
    const [input, setInput] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), type: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');

        // Simulate AI Response
        setTimeout(() => {
            const botMsg = { id: Date.now() + 1, type: 'bot', text: "I'm processing your request... This is a simulated response in the MVP." };
            setMessages(prev => [...prev, botMsg]);
        }, 1000);
    };

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden rounded-2xl mx-4 mb-4 glass-card border-none shadow-xl">
            {/* Sidebar */}
            <div className={`${isSidebarOpen ? 'w-64' : 'w-0'} bg-white/40 border-r border-white/50 transition-all duration-300 ease-in-out flex flex-col backdrop-blur-sm`}>
                <div className="p-4 border-b border-white/50 flex items-center justify-between">
                    <button className="flex items-center gap-2 bg-white/60 border border-white/50 text-silver-600 px-3 py-2 rounded-xl hover:bg-white/80 transition-colors text-sm w-full shadow-sm">
                        <Plus className="w-4 h-4" /> New Chat
                    </button>
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-1 text-silver-500">
                        ×
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="text-xs font-bold text-silver-400 mb-3 uppercase tracking-wider pl-2">Recent</div>
                    <div className="space-y-2">
                        <button className="text-left w-full px-3 py-2 text-sm text-silver-600 hover:bg-white/60 rounded-lg truncate transition-colors">
                            University Requirements
                        </button>
                        <button className="text-left w-full px-3 py-2 text-sm text-silver-600 hover:bg-white/60 rounded-lg truncate transition-colors">
                            Career in AI
                        </button>
                    </div>
                </div>
                <div className="p-4 border-t border-white/50">
                    <div className="flex items-center gap-2 text-sm text-silver-500/80 font-medium">
                        <Bot className="w-4 h-4 text-pastel-pinkDeep" />
                        <span>AI Assistant v1.0</span>
                    </div>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col relative bg-transparent">
                {/* Mobile Toggle */}
                {!isSidebarOpen && (
                    <div className="absolute top-4 left-4 z-10">
                        <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-white/70 rounded-lg shadow-sm border border-white/50 backdrop-blur-md">
                            <Menu className="w-4 h-4 text-silver-600" />
                        </button>
                    </div>
                )}

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
                    <div className="max-w-3xl mx-auto space-y-6">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex gap-4 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.type === 'bot' && (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pastel-purple to-pastel-blue flex items-center justify-center flex-shrink-0 shadow-sm border border-white">
                                        <Bot className="w-5 h-5 text-indigo-500" />
                                    </div>
                                )}

                                <div className={`px-5 py-3 rounded-2xl max-w-[80%] shadow-sm backdrop-blur-sm ${msg.type === 'user'
                                    ? 'bg-gradient-to-r from-silver-800 to-silver-700 text-white rounded-br-none shadow-md'
                                    : 'bg-white/60 border border-white/50 text-silver-800 rounded-bl-none shadow-sm'
                                    }`}>
                                    <p className="leading-relaxed text-sm md:text-base">{msg.text}</p>
                                </div>

                                {msg.type === 'user' && (
                                    <div className="w-8 h-8 rounded-full bg-silver-200 flex items-center justify-center flex-shrink-0 border border-white">
                                        <User className="w-5 h-5 text-silver-600" />
                                    </div>
                                )}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Input Area */}
                <div className="p-4 md:p-6 border-t border-white/40 bg-white/30 backdrop-blur-md">
                    <div className="max-w-3xl mx-auto relative">
                        <form onSubmit={handleSend} className="relative group">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Message AI Assistant..."
                                className="w-full pl-6 pr-14 py-4 glass-input rounded-2xl outline-none focus:ring-2 focus:ring-pastel-pink/30 shadow-sm text-silver-800 placeholder-silver-400 group-hover:bg-white/60 transition-all"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim()}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-silver-800 text-white rounded-xl hover:bg-silver-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                        <p className="text-center text-xs text-silver-400 mt-2">
                            AI can make mistakes. Consider checking important information.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;

import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, User, FileText, Home, Bot } from 'lucide-react';

const Navbar = () => {
    return (
        <nav className="glass-card sticky top-0 z-50 rounded-b-2xl mx-4 mt-2">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
                            <div className="w-8 h-8 bg-gradient-to-tr from-pastel-pinkDeep to-silver-400 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all transform group-hover:rotate-3">
                                <GraduationCap className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-bold text-xl text-silver-800 tracking-tight">Career Compass</span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Link to="/" className="text-silver-600 hover:text-pastel-pinkDeep hover:bg-pastel-pink/50 px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1">
                            <Home className="w-4 h-4" /> Home
                        </Link>
                        <Link to="/chatbot" className="text-silver-600 hover:text-pastel-pinkDeep hover:bg-pastel-pink/50 px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1">
                            <Bot className="w-4 h-4" /> AI Chat
                        </Link>
                        <Link to="/quiz" className="text-silver-600 hover:text-pastel-pinkDeep hover:bg-pastel-pink/50 px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1">
                            <FileText className="w-4 h-4" /> Quiz
                        </Link>
                        <Link to="/login" className="ml-2 btn-primary px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                            <User className="w-4 h-4" /> Login
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

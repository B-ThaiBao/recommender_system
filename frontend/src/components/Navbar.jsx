import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, User, FileText, Home, Bot, BookOpen, LogOut, Award, Sparkles } from 'lucide-react';
import { clearAuthSession, getAuthUser } from '../lib/auth';

const Navbar = () => {
    const navigate = useNavigate();
    const authUser = getAuthUser();

    const handleLogout = () => {
        clearAuthSession();
        navigate('/login');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-[200] px-3 sm:px-6 lg:px-8 pt-3">
            <div className="glass-card rounded-3xl border border-white/80 shadow-[0_18px_48px_rgba(20,16,12,0.2)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-3 py-3 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center justify-between gap-3">
                            <Link to="/" className="flex items-center gap-3 group">
                                <div className="w-11 h-11 bg-gradient-to-br from-slate-900 via-slate-800 to-coral-500 rounded-2xl flex items-center justify-center shadow-lg shadow-slate-900/10 group-hover:scale-105 transition-transform">
                                    <GraduationCap className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-lg text-slate-900 tracking-tight">Insight</span>
                                        <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.2em] bg-teal-100 text-teal-400">
                                            <Sparkles className="w-3 h-3" /> Product
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500">Career intelligence platform for students and academic counselors</p>
                                </div>
                            </Link>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                            <Link to="/" className="text-slate-600 hover:text-slate-900 hover:bg-white/80 px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2">
                                <Home className="w-4 h-4" /> Home
                            </Link>
                            <Link to="/quiz" className="text-slate-600 hover:text-slate-900 hover:bg-white/80 px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2">
                                <BookOpen className="w-4 h-4" /> Quiz
                            </Link>
                            <Link to="/grades" className="text-slate-600 hover:text-slate-900 hover:bg-white/80 px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2">
                                <Award className="w-4 h-4" /> Grades
                            </Link>
                            <Link to="/chatbot" className="text-slate-600 hover:text-slate-900 hover:bg-white/80 px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2">
                                <Bot className="w-4 h-4" /> AI Chat
                            </Link>
                            <Link to="/recommendations" className="text-slate-600 hover:text-slate-900 hover:bg-white/80 px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2">
                                <FileText className="w-4 h-4" /> Results
                            </Link>
                            {authUser ? (
                                <button onClick={handleLogout} className="ml-0 lg:ml-2 btn-pastel px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
                                    <LogOut className="w-4 h-4" /> Logout
                                </button>
                            ) : (
                                <Link to="/login" className="ml-0 lg:ml-2 btn-primary px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
                                    <User className="w-4 h-4" /> Login
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

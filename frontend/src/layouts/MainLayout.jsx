import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';

const MainLayout = () => {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <div className="page-shell min-h-screen flex flex-col text-slate-800">
            <Navbar />
            <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 lg:pt-36 pb-6 sm:pb-8 lg:pb-10">
                <div key={location.pathname} className="page-transition">
                    <Outlet />
                </div>
            </main>
            <footer className="relative z-10 mt-auto border-t border-white/70 bg-white/55 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-slate-500 text-sm">
                    © 2026 Insight. Career intelligence product experience.<br />
                    <span className="text-xs text-slate-400">Unified workflow with quiz, grades, recommendations, and contextual AI guidance.</span>
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;

import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const MainLayout = () => {
    return (
        <div className="font-sans text-silver-800">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>
            <footer className="bg-white border-t border-silver-200 py-6 mt-auto">
                <div className="max-w-7xl mx-auto px-4 text-center text-silver-500 text-sm">
                    © 2024 Career Compass. All rights reserved. <br />
                    <span className="text-xs text-silver-400">Committed to protecting your privacy (PDPA/GDPR Compliant)</span>
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;

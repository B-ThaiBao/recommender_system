import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, ArrowRight } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        // Mock Login for MVP
        if (username === 'student' && password === '123456') {
            navigate('/');
        } else {
            setError('Invalid username or password');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-silver-100">
                <div className="text-center mb-8">
                    <div className="mx-auto w-12 h-12 bg-pastel-pink rounded-full flex items-center justify-center mb-4">
                        <User className="w-6 h-6 text-silver-800" />
                    </div>
                    <h2 className="text-2xl font-bold text-silver-800">Welcome Back</h2>
                    <p className="text-silver-500 mt-2">Login to access your dashboard</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-silver-700 mb-2">Username</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-silver-400" />
                            <input
                                type="text"
                                className="w-full pl-10 pr-4 py-3 border border-silver-200 rounded-xl focus:ring-2 focus:ring-pastel-pink focus:border-silver-400 outline-none transition-all placeholder:text-silver-300"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-silver-700 mb-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-silver-400" />
                            <input
                                type="password"
                                className="w-full pl-10 pr-4 py-3 border border-silver-200 rounded-xl focus:ring-2 focus:ring-pastel-pink focus:border-silver-400 outline-none transition-all placeholder:text-silver-300"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-silver-800 text-white py-3 rounded-xl font-semibold hover:bg-silver-900 transition-colors shadow-lg flex items-center justify-center gap-2"
                    >
                        Login <ArrowRight className="w-4 h-4" />
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-silver-500">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-silver-800 font-bold hover:underline">
                        Register
                    </Link>
                </div>

                <div className="mt-4 text-center text-xs text-silver-400 bg-silver-50 p-2 rounded-lg">
                    <p>Test Account: <b>student</b> / <b>123456</b></p>
                </div>
            </div>
        </div>
    );
};

export default Login;

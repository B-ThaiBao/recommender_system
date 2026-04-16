import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, Lock, UserPlus, User } from 'lucide-react';
import { ENDPOINTS } from '../config/api';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      const response = await fetch(ENDPOINTS.auth.register, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.detail || 'Registration failed');
      }

      setSuccess('Đăng ký thành công. Bạn có thể đăng nhập ngay.');
      setTimeout(() => navigate('/login'), 900);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-silver-100">
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-pastel-blue rounded-full flex items-center justify-center mb-4">
            <UserPlus className="w-6 h-6 text-silver-800" />
          </div>
          <h2 className="text-2xl font-bold text-silver-800">Create account</h2>
          <p className="text-silver-500 mt-2">Register to save quiz results and recommendations</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">{error}</div>}
          {success && <div className="bg-emerald-50 text-emerald-700 p-3 rounded-lg text-sm text-center">{success}</div>}

          <div>
            <label className="block text-sm font-medium text-silver-700 mb-2">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-silver-400" />
              <input
                type="text"
                name="username"
                className="w-full pl-10 pr-4 py-3 border border-silver-200 rounded-xl focus:ring-2 focus:ring-pastel-pink focus:border-silver-400 outline-none transition-all"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-silver-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-silver-400" />
              <input
                type="email"
                name="email"
                className="w-full pl-10 pr-4 py-3 border border-silver-200 rounded-xl focus:ring-2 focus:ring-pastel-pink focus:border-silver-400 outline-none transition-all"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-silver-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-silver-400" />
              <input
                type="password"
                name="password"
                className="w-full pl-10 pr-4 py-3 border border-silver-200 rounded-xl focus:ring-2 focus:ring-pastel-pink focus:border-silver-400 outline-none transition-all"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-silver-800 text-white py-3 rounded-xl font-semibold hover:bg-silver-900 transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isSubmitting ? 'Creating...' : 'Register'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-silver-500">
          Already have an account?{' '}
          <Link to="/login" className="text-silver-800 font-bold hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
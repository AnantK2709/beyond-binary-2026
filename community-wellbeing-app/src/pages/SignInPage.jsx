import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MOCK_USERS } from '../utils/mockData';
import { Flower2, Briefcase, Users, Star } from 'lucide-react';

export default function SignInPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = signIn(formData.email, formData.password);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Demo credentials helper
  const fillDemoCredentials = (userId) => {
    const demoUser = MOCK_USERS.find(u => u.id === userId);
    if (demoUser) {
      setFormData({
        email: demoUser.email,
        password: demoUser.password,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8 animate-scale-in">
          <Link to="/" className="inline-flex items-center gap-2">
            <Flower2 size={36} className="text-sage-500" />
            <span className="text-3xl font-bold text-gradient">MindfulCircles</span>
          </Link>
          <p className="text-gray-600 mt-2">Welcome back!</p>
        </div>

        {/* Sign In Card */}
        <div className="card animate-slide-up-fade">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Sign In</h2>

          {error && (
            <div className="mb-4 p-4 rounded-xl bg-red-50/50 border border-red-200/50 backdrop-blur-sm">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-sage-600 font-semibold hover:text-sage-700 transition-colors">
                Sign Up
              </Link>
            </p>
          </div>

          {/* Demo Accounts */}
          <div className="mt-8 pt-6 border-t border-gray-200/50">
            <p className="text-sm font-semibold text-gray-900 mb-3 text-center">
              Demo Accounts (for testing):
            </p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => fillDemoCredentials('u001')}
                className="w-full text-left px-4 py-3 rounded-xl transition-all hover:scale-[1.02]"
                style={{
                  background: 'rgba(168, 213, 186, 0.15)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(168, 213, 186, 0.2)',
                }}
              >
                <div className="flex items-center gap-3">
                  <Briefcase size={24} className="text-sage-600" />
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">Sarah Chen</div>
                    <div className="text-xs text-gray-600">Tech professional, 28</div>
                  </div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('u002')}
                className="w-full text-left px-4 py-3 rounded-xl transition-all hover:scale-[1.02]"
                style={{
                  background: 'rgba(168, 213, 186, 0.15)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(168, 213, 186, 0.2)',
                }}
              >
                <div className="flex items-center gap-3">
                  <Users size={24} className="text-sage-600" />
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">Marcus Johnson</div>
                    <div className="text-xs text-gray-600">Parent, 42</div>
                  </div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('u003')}
                className="w-full text-left px-4 py-3 rounded-xl transition-all hover:scale-[1.02]"
                style={{
                  background: 'rgba(168, 213, 186, 0.15)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(168, 213, 186, 0.2)',
                }}
              >
                <div className="flex items-center gap-3">
                  <Star size={24} className="text-sage-600" />
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">Priya Kumar</div>
                    <div className="text-xs text-gray-600">Recent grad, 24</div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
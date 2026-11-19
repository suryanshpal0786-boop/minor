import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Mail, ArrowRight, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(
    searchParams.get('expired') ? 'Your session has expired. Please sign in again.' : ''
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email.trim(), password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-[#fbfbfd]">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 mb-4 group">
            <div className="w-10 h-10 rounded-xl bg-[#0071e3] flex items-center justify-center text-white shadow-sm shadow-[#0071e3]/20">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <circle cx="11" cy="11" r="2.5" fill="currentColor" />
              </svg>
            </div>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight text-[#1d1d1f]">
            Sign In to TruthLens
          </h2>
          <p className="mt-1 text-xs text-[#86868b]">
            Enter your credentials to access your verification workspace
          </p>
        </div>

        <div className="bg-white p-7 sm:p-9 rounded-3xl border border-[#e5e5e7] shadow-apple-card">
          {error && (
            <div className="mb-5 p-3 rounded-2xl bg-[#fff2f1] border border-[#fbcbc8] flex items-center space-x-2 text-xs text-[#c9251c]">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#86868b] absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@organization.com"
                  className="w-full bg-[#fbfbfd] border border-[#e5e5e7] rounded-2xl py-2.5 pl-10 pr-4 text-xs sm:text-sm text-[#1d1d1f] placeholder-[#86868b] focus:outline-none focus:border-[#0071e3] focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-[#1d1d1f]">Password</label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-[#0071e3] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#86868b] absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#fbfbfd] border border-[#e5e5e7] rounded-2xl py-2.5 pl-10 pr-4 text-xs sm:text-sm text-[#1d1d1f] placeholder-[#86868b] focus:outline-none focus:border-[#0071e3] focus:bg-white transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-[#0071e3] hover:bg-[#0077ed] disabled:opacity-50 text-white text-xs sm:text-sm font-semibold rounded-full shadow-sm flex items-center justify-center space-x-2 transition active:scale-98 mt-4"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-[#86868b]">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#0071e3] hover:underline font-semibold">
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../services/api';

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [token, setToken] = useState(searchParams.get('token') || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/reset-password', {
        token,
        newPassword,
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password. Token may be invalid.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-[#fbfbfd]">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-[#1d1d1f]">
            Create New Password
          </h2>
          <p className="mt-1 text-xs text-[#86868b]">
            Set a secure password for your TruthLens account
          </p>
        </div>

        <div className="bg-white p-7 sm:p-9 rounded-3xl border border-[#e5e5e7] shadow-apple-card">
          {error && (
            <div className="mb-4 p-3 rounded-2xl bg-[#fff2f1] border border-[#fbcbc8] text-xs text-[#c9251c] flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success ? (
            <div className="space-y-3 text-center">
              <div className="w-12 h-12 rounded-full bg-[#f0f9f3] text-[#1b7a37] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#1d1d1f]">Password Updated</h3>
              <p className="text-xs text-[#86868b]">
                Your password has been reset. Redirecting to sign in...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5">
                  Reset Token
                </label>
                <input
                  type="text"
                  required
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Paste reset token..."
                  className="w-full bg-[#fbfbfd] border border-[#e5e5e7] rounded-2xl py-2.5 px-4 text-xs font-mono text-[#1d1d1f] focus:outline-none focus:border-[#0071e3] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#86868b] absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#fbfbfd] border border-[#e5e5e7] rounded-2xl py-2.5 pl-10 pr-4 text-xs sm:text-sm text-[#1d1d1f] placeholder-[#86868b] focus:outline-none focus:border-[#0071e3] transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#86868b] absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#fbfbfd] border border-[#e5e5e7] rounded-2xl py-2.5 pl-10 pr-4 text-xs sm:text-sm text-[#1d1d1f] placeholder-[#86868b] focus:outline-none focus:border-[#0071e3] transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-[#0071e3] hover:bg-[#0077ed] disabled:opacity-50 text-white text-xs sm:text-sm font-semibold rounded-full shadow-sm flex items-center justify-center space-x-2 transition active:scale-98 mt-2"
              >
                <span>{loading ? 'Updating Password...' : 'Save New Password'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

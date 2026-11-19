import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../services/api';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/forgot-password', { email });
      setSubmitted(true);
      if (res.data.resetToken) {
        setResetToken(res.data.resetToken);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit reset request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-[#fbfbfd]">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-[#1d1d1f]">
            Reset Your Password
          </h2>
          <p className="mt-1 text-xs text-[#86868b]">
            Enter your verified account email to initiate recovery
          </p>
        </div>

        <div className="bg-white p-7 sm:p-9 rounded-3xl border border-[#e5e5e7] shadow-apple-card">
          {error && (
            <div className="mb-4 p-3 rounded-2xl bg-[#fff2f1] border border-[#fbcbc8] text-xs text-[#c9251c] flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {submitted ? (
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-[#f0f9f3] text-[#1b7a37] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#1d1d1f]">Reset Instructions Sent</h3>
              <p className="text-xs text-[#86868b] leading-relaxed">
                If an account exists for <strong className="text-[#1d1d1f]">{email}</strong>, recovery instructions have been prepared.
              </p>
              {resetToken && (
                <div className="p-3 rounded-xl bg-[#f5f5f7] border border-[#e5e5e7] text-left space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#86868b]">
                    Academic Demo Token:
                  </span>
                  <p className="text-xs font-mono break-all text-[#1d1d1f]">{resetToken}</p>
                  <Link
                    to={`/reset-password?token=${resetToken}`}
                    className="inline-block text-xs font-semibold text-[#0071e3] hover:underline pt-1"
                  >
                    Click to proceed with password reset →
                  </Link>
                </div>
              )}
              <div className="pt-2">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-[#0071e3] hover:underline inline-flex items-center space-x-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Sign In</span>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5">
                  Account Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#86868b] absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@organization.com"
                    className="w-full bg-[#fbfbfd] border border-[#e5e5e7] rounded-2xl py-2.5 pl-10 pr-4 text-xs sm:text-sm text-[#1d1d1f] placeholder-[#86868b] focus:outline-none focus:border-[#0071e3] transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-[#0071e3] hover:bg-[#0077ed] disabled:opacity-50 text-white text-xs sm:text-sm font-semibold rounded-full shadow-sm flex items-center justify-center space-x-2 transition active:scale-98"
              >
                <span>{loading ? 'Sending Request...' : 'Send Reset Link'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <Link
                  to="/login"
                  className="text-xs text-[#86868b] hover:text-[#1d1d1f] inline-flex items-center space-x-1"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

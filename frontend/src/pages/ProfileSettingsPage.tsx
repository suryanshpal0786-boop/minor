import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Lock,
  Shield,
  Trash2,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ArrowRight,
} from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export const ProfileSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateProfile, logout } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profileMsg, setProfileMsg] = useState({ text: '', type: '' });
  const [profileLoading, setProfileLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passMsg, setPassMsg] = useState({ text: '', type: '' });
  const [passLoading, setPassLoading] = useState(false);

  const [deletingAccount, setDeletingAccount] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg({ text: '', type: '' });
    setProfileLoading(true);

    try {
      await updateProfile(fullName, email);
      setProfileMsg({ text: 'Profile updated successfully.', type: 'success' });
    } catch (err: any) {
      setProfileMsg({
        text: err.response?.data?.message || 'Failed to update profile.',
        type: 'error',
      });
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMsg({ text: '', type: '' });

    if (newPassword.length < 6) {
      setPassMsg({ text: 'New password must be at least 6 characters.', type: 'error' });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPassMsg({ text: 'New passwords do not match.', type: 'error' });
      return;
    }

    setPassLoading(true);

    try {
      const res = await api.put('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      if (res.data.success) {
        setPassMsg({ text: 'Password changed successfully.', type: 'success' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      }
    } catch (err: any) {
      setPassMsg({
        text: err.response?.data?.message || 'Failed to change password. Please verify current password.',
        type: 'error',
      });
    } finally {
      setPassLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmation = window.prompt(
      'WARNING: This will permanently delete your account and all associated analyses. Type "DELETE" to confirm:'
    );
    if (confirmation !== 'DELETE') return;

    setDeletingAccount(true);
    try {
      await api.delete('/auth/account');
      alert('Your account has been deleted.');
      logout();
    } catch {
      alert('Failed to delete account.');
      setDeletingAccount(false);
    }
  };

  return (
    <DashboardLayout
      activeKey="profile"
      title="Profile & Settings"
      subtitle="Manage your personal details, credentials, and account preferences."
    >
      <div className="max-w-3xl space-y-8">
        {/* Profile Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e5e5e7] shadow-apple-card space-y-6">
          <div className="flex items-center space-x-3 pb-4 border-b border-[#e5e5e7]">
            <div className="w-10 h-10 rounded-2xl bg-[#e8f2fc] text-[#0071e3] flex items-center justify-center font-bold text-sm">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1d1d1f]">Account Information</h3>
              <p className="text-xs text-[#86868b]">Role: <span className="capitalize font-semibold text-[#1d1d1f]">{user?.role}</span></p>
            </div>
          </div>

          {profileMsg.text && (
            <div
              className={`p-3.5 rounded-2xl text-xs flex items-center space-x-2 ${
                profileMsg.type === 'success'
                  ? 'bg-[#f0f9f3] text-[#1b7a37] border border-[#c3e8cd]'
                  : 'bg-[#fff2f1] text-[#c9251c] border border-[#fbcbc8]'
              }`}
            >
              {profileMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
              )}
              <span>{profileMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#86868b] absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#fbfbfd] border border-[#e5e5e7] rounded-2xl py-2.5 pl-10 pr-4 text-xs sm:text-sm text-[#1d1d1f] focus:outline-none focus:border-[#0071e3] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#86868b] absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#fbfbfd] border border-[#e5e5e7] rounded-2xl py-2.5 pl-10 pr-4 text-xs sm:text-sm text-[#1d1d1f] focus:outline-none focus:border-[#0071e3] transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={profileLoading}
              className="px-5 py-2.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold shadow-sm transition active:scale-95 disabled:opacity-50"
            >
              {profileLoading ? 'Saving...' : 'Update Profile'}
            </button>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e5e5e7] shadow-apple-card space-y-6">
          <div className="flex items-center space-x-3 pb-4 border-b border-[#e5e5e7]">
            <div className="w-10 h-10 rounded-2xl bg-[#f5f5f7] text-[#1d1d1f] flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1d1d1f]">Security & Password</h3>
              <p className="text-xs text-[#86868b]">Ensure your account uses a strong credentials profile</p>
            </div>
          </div>

          {passMsg.text && (
            <div
              className={`p-3.5 rounded-2xl text-xs flex items-center space-x-2 ${
                passMsg.type === 'success'
                  ? 'bg-[#f0f9f3] text-[#1b7a37] border border-[#c3e8cd]'
                  : 'bg-[#fff2f1] text-[#c9251c] border border-[#fbcbc8]'
              }`}
            >
              {passMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
              )}
              <span>{passMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5">
                Current Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#86868b] absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#fbfbfd] border border-[#e5e5e7] rounded-2xl py-2.5 pl-10 pr-4 text-xs sm:text-sm text-[#1d1d1f] focus:outline-none focus:border-[#0071e3] transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    className="w-full bg-[#fbfbfd] border border-[#e5e5e7] rounded-2xl py-2.5 pl-10 pr-4 text-xs sm:text-sm text-[#1d1d1f] focus:outline-none focus:border-[#0071e3] transition"
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
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#fbfbfd] border border-[#e5e5e7] rounded-2xl py-2.5 pl-10 pr-4 text-xs sm:text-sm text-[#1d1d1f] focus:outline-none focus:border-[#0071e3] transition"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={passLoading}
              className="px-5 py-2.5 rounded-full bg-[#1d1d1f] hover:bg-black text-white text-xs font-semibold shadow-sm transition active:scale-95 disabled:opacity-50"
            >
              {passLoading ? 'Updating Password...' : 'Change Password'}
            </button>
          </form>
        </div>

        {/* Danger Zone: Delete Account */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#fbcbc8] shadow-apple-card space-y-4">
          <h3 className="text-base font-bold text-[#c9251c] flex items-center space-x-2">
            <Trash2 className="w-5 h-5" />
            <span>Danger Zone</span>
          </h3>
          <p className="text-xs text-[#86868b] leading-relaxed">
            Deleting your account will permanently purge your verification history, saved reports, and authentication credentials. This action cannot be undone.
          </p>

          <button
            type="button"
            onClick={handleDeleteAccount}
            disabled={deletingAccount}
            className="px-5 py-2 rounded-full bg-[#fff2f1] hover:bg-[#ffe5e3] border border-[#fbcbc8] text-[#c9251c] text-xs font-bold transition active:scale-95 disabled:opacity-50"
          >
            {deletingAccount ? 'Purging...' : 'Delete Account Permanently'}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

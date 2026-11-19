import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  History,
  Bookmark,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeKey?: string;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  activeKey,
  title,
  subtitle,
  actions,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarLinks = [
    {
      key: 'overview',
      label: 'Overview',
      path: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      key: 'verify',
      label: 'Verify News',
      path: '/dashboard/verify',
      icon: Search,
    },
    {
      key: 'history',
      label: 'Analysis History',
      path: '/dashboard/history',
      icon: History,
    },
    {
      key: 'saved',
      label: 'Saved Reports',
      path: '/dashboard/saved',
      icon: Bookmark,
    },
    {
      key: 'profile',
      label: 'Profile & Settings',
      path: '/dashboard/profile',
      icon: Settings,
    },
  ];

  const currentPath = location.pathname;

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex">
      {/* Sidebar Desktop */}
      <aside
        className={`hidden md:flex flex-col bg-white border-r border-[#e5e5e7] transition-all duration-300 relative z-20 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Brand header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-[#e5e5e7]/60">
          <Link to="/" className="flex items-center space-x-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-[#0071e3] flex-shrink-0 flex items-center justify-center text-white shadow-sm shadow-[#0071e3]/20">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <circle cx="11" cy="11" r="2.5" fill="currentColor" />
              </svg>
            </div>
            {!collapsed && (
              <span className="font-bold text-sm text-[#1d1d1f] tracking-tight whitespace-nowrap">
                TruthLens
              </span>
            )}
          </Link>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-lg text-[#86868b] hover:text-[#1d1d1f] hover:bg-[#f5f5f7] transition"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {sidebarLinks.map((item) => {
            const Icon = item.icon;
            const isActive =
              activeKey === item.key ||
              (item.path === '/dashboard' && currentPath === '/dashboard') ||
              (item.path !== '/dashboard' && currentPath.startsWith(item.path));

            return (
              <Link
                key={item.key}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#0071e3] text-white shadow-sm shadow-[#0071e3]/25'
                    : 'text-[#1d1d1f]/80 hover:bg-[#f5f5f7] hover:text-[#1d1d1f]'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-[#86868b]'}`} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>

        {/* Bottom Profile card */}
        <div className="p-3 border-t border-[#e5e5e7]/70 bg-white">
          <div
            className={`flex items-center ${
              collapsed ? 'justify-center' : 'justify-between'
            } p-2 rounded-xl bg-[#f5f5f7]/70`}
          >
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-[#e8f2fc] text-[#0071e3] flex-shrink-0 flex items-center justify-center font-bold text-xs">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
              {!collapsed && (
                <div className="overflow-hidden">
                  <p className="text-xs font-semibold text-[#1d1d1f] truncate">
                    {user?.fullName}
                  </p>
                  <p className="text-[10px] text-[#86868b] truncate">
                    News Intelligence Workspace
                  </p>
                </div>
              )}
            </div>

            {!collapsed && (
              <button
                onClick={logout}
                title="Log out"
                className="p-1.5 rounded-lg text-[#86868b] hover:text-[#c9251c] hover:bg-[#fff2f1] transition"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar on Mobile / Breadcrumb */}
        <header className="h-14 bg-white border-b border-[#e5e5e7] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-1.5 rounded-lg text-[#1d1d1f] hover:bg-[#f5f5f7]"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link to="/" className="text-xs text-[#86868b] hover:text-[#1d1d1f] flex items-center space-x-1">
              <span>TruthLens</span>
              <span>/</span>
            </Link>
            <span className="text-xs font-semibold text-[#1d1d1f] capitalize">
              {title || 'Workspace'}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              to="/dashboard/verify"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold shadow-sm transition active:scale-95"
            >
              <Search className="w-3 h-3" />
              <span>Verify News</span>
            </Link>
          </div>
        </header>

        {/* Page Content View */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {(title || subtitle || actions) && (
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                {title && (
                  <h1 className="text-2xl font-bold tracking-tight text-[#1d1d1f]">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="text-xs sm:text-sm text-[#86868b] mt-0.5">
                    {subtitle}
                  </p>
                )}
              </div>
              {actions && <div className="flex items-center space-x-2">{actions}</div>}
            </div>
          )}

          {children}
        </main>
      </div>

      {/* Mobile Sidebar Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 bg-white h-full flex flex-col p-5 shadow-apple-modal z-10">
            <div className="flex items-center justify-between pb-4 border-b border-[#e5e5e7]">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-[#0071e3] flex items-center justify-center text-white">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
                <span className="font-bold text-sm text-[#1d1d1f]">TruthLens</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1 rounded-lg text-[#86868b] hover:text-[#1d1d1f]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 py-4 space-y-1.5 overflow-y-auto">
              {sidebarLinks.map((item) => {
                const Icon = item.icon;
                const isActive = activeKey === item.key;
                return (
                  <Link
                    key={item.key}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                      isActive
                        ? 'bg-[#0071e3] text-white'
                        : 'text-[#1d1d1f] hover:bg-[#f5f5f7]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="pt-4 border-t border-[#e5e5e7]">
              <button
                onClick={logout}
                className="w-full flex items-center space-x-2 text-xs font-semibold text-[#c9251c] py-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

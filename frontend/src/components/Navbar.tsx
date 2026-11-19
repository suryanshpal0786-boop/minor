import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, LogOut, LayoutDashboard, Menu, X, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'How It Works', path: '/#how-it-works' },
    { label: 'Features', path: '/#features' },
    { label: 'About', path: '/#about' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    if (href.startsWith('/#')) {
      const hash = href.replace('/', '');
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#e5e5e7]/70 bg-white/80 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[#0071e3] flex items-center justify-center text-white shadow-sm shadow-[#0071e3]/20 group-hover:scale-105 transition-transform">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <circle cx="11" cy="11" r="2.5" fill="currentColor" />
            </svg>
          </div>
          <span className="text-base font-bold text-[#1d1d1f] tracking-tight group-hover:text-[#0071e3] transition-colors">
            TruthLens
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-7 text-xs font-medium text-[#1d1d1f]/80">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.path}
              onClick={(e) => {
                if (link.path.startsWith('/#')) {
                  e.preventDefault();
                  handleNavClick(link.path);
                }
              }}
              className="hover:text-[#0071e3] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right CTA / Auth controls */}
        <div className="hidden md:flex items-center space-x-3 text-xs">
          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <Link
                to="/dashboard"
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#f5f5f7] hover:bg-[#e5e5e7] text-[#1d1d1f] font-medium transition"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-[#0071e3]" />
                <span>Dashboard</span>
              </Link>

              <div className="flex items-center space-x-1.5 pl-2 border-l border-[#e5e5e7]">
                <span className="font-medium text-[#1d1d1f] max-w-[120px] truncate">
                  {user?.fullName?.split(' ')[0]}
                </span>
                <button
                  onClick={logout}
                  title="Sign out"
                  className="p-1.5 rounded-full text-[#86868b] hover:text-[#c9251c] hover:bg-[#fff2f1] transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="text-[#1d1d1f] hover:text-[#0071e3] font-medium px-2 py-1 transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center space-x-1 px-4 py-1.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium shadow-sm transition active:scale-95"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-1.5 rounded-lg text-[#1d1d1f] hover:bg-[#f5f5f7]"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#e5e5e7] bg-white px-4 py-5 space-y-3 shadow-apple-hover">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.path}
              onClick={(e) => {
                if (link.path.startsWith('/#')) {
                  e.preventDefault();
                  handleNavClick(link.path);
                } else {
                  setMobileMenuOpen(false);
                }
              }}
              className="block text-sm font-medium text-[#1d1d1f] py-1.5"
            >
              {link.label}
            </a>
          ))}

          <div className="pt-3 border-t border-[#e5e5e7] space-y-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-semibold text-[#0071e3] py-1.5"
                >
                  Open Dashboard ({user?.fullName})
                </Link>
                <button
                  onClick={logout}
                  className="block w-full text-left text-sm text-[#c9251c] py-1.5 font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 rounded-xl bg-[#f5f5f7] text-[#1d1d1f] text-xs font-semibold"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 rounded-xl bg-[#0071e3] text-white text-xs font-semibold"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

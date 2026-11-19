import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowUpRight, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-[#e5e5e7] bg-[#f5f5f7] py-14 text-xs text-[#86868b] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {/* Brand col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-md bg-[#0071e3] flex items-center justify-center text-white">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <span className="font-bold text-[#1d1d1f] text-sm">TruthLens</span>
            </div>
            <p className="text-[#86868b] max-w-sm leading-relaxed text-xs">
              Intelligent news verification and explainable AI platform engineered for transparent, probabilistic media analysis. Designed with Apple-grade clarity and restraint.
            </p>
            <div className="pt-2 text-[11px] text-[#86868b]">
              BCA Academic Minor Project • AI-Assisted News Verification
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-semibold text-[#1d1d1f] text-xs mb-3 tracking-tight">Platform</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-[#0071e3] transition">
                  News Verification
                </Link>
              </li>
              <li>
                <Link to="/#how-it-works" className="hover:text-[#0071e3] transition">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/#features" className="hover:text-[#0071e3] transition">
                  Detection Features
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-[#0071e3] transition">
                  User Workspace
                </Link>
              </li>
            </ul>
          </div>

          {/* Academic & Method */}
          <div>
            <h4 className="font-semibold text-[#1d1d1f] text-xs mb-3 tracking-tight">Technology</h4>
            <ul className="space-y-2">
              <li>
                <span className="text-[#86868b]">React 18 + TypeScript</span>
              </li>
              <li>
                <span className="text-[#86868b]">Node.js + Express API</span>
              </li>
              <li>
                <span className="text-[#86868b]">Socket.io Real-time</span>
              </li>
              <li>
                <span className="text-[#86868b]">MongoDB + Mongoose</span>
              </li>
              <li>
                <span className="text-[#86868b]">NLP Stylometry Engine</span>
              </li>
            </ul>
          </div>

          {/* Transparency & Legal */}
          <div>
            <h4 className="font-semibold text-[#1d1d1f] text-xs mb-3 tracking-tight">Governance</h4>
            <ul className="space-y-2">
              <li>
                <span className="hover:text-[#0071e3] cursor-pointer">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="hover:text-[#0071e3] cursor-pointer">
                  Terms of Service
                </span>
              </li>
              <li>
                <span className="hover:text-[#0071e3] cursor-pointer">
                  Ethical AI Standards
                </span>
              </li>
              <li>
                <span className="hover:text-[#0071e3] cursor-pointer">
                  Contact Research Team
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Card */}
        <div className="p-4 rounded-2xl bg-white border border-[#e5e5e7] text-[11px] text-[#86868b] leading-relaxed mb-8">
          <strong className="text-[#1d1d1f] font-semibold block mb-0.5">Automated Assessment Notice:</strong>
          TruthLens provides probabilistic evaluations based on linguistic stylometry, emotional arousal markers, and domain trust heuristics. It does not replace independent primary journalism or legal fact-checking. Automated confidence scores represent model pattern certainty, never absolute truth.
        </div>

        {/* Bottom copyright row */}
        <div className="pt-6 border-t border-[#e5e5e7] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#86868b]">
          <p>© 2026 TruthLens. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">
            Crafted for BCA Academic Evaluation • Inspired by Apple Design Philosophy
          </p>
        </div>
      </div>
    </footer>
  );
};

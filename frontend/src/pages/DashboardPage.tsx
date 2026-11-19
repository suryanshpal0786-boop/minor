import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  HelpCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  Bookmark,
  ExternalLink,
  Plus,
} from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { ClassificationBadge } from '../components/ClassificationBadge';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { NewsAnalysis } from '../types';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [analyses, setAnalyses] = useState<NewsAnalysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAnalyses = async () => {
      try {
        const res = await api.get('/analysis/user/history?limit=5');
        if (res.data.success) {
          setAnalyses(res.data.items || []);
        }
      } catch (err) {
        console.error('Failed to load user analyses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAnalyses();
  }, []);

  // Compute real metrics from the user's analyses
  const totalAnalyses = analyses.length;
  const appearsCredibleCount = analyses.filter((a) => a.classification === 'Appears Credible').length;
  const potentiallyMisleadingCount = analyses.filter(
    (a) => a.classification === 'Potentially Misleading'
  ).length;
  const suspiciousCount = analyses.filter((a) => a.classification === 'Suspicious').length;
  const inconclusiveCount = analyses.filter((a) => a.classification === 'Inconclusive').length;

  return (
    <DashboardLayout
      activeKey="overview"
      title={`Welcome back, ${user?.fullName || 'User'}`}
      subtitle="Your news verification workspace."
      actions={
        <Link
          to="/dashboard/verify"
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold shadow-sm transition active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Verification</span>
        </Link>
      }
    >
      <div className="space-y-8">
        {/* Real Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 rounded-3xl bg-white border border-[#e5e5e7] shadow-apple-card">
            <span className="text-xs font-medium text-[#86868b] block mb-1">Total Analyses</span>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-[#1d1d1f] font-mono">
                {totalAnalyses}
              </span>
              <span className="text-[11px] text-[#86868b]">Submissions</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#e5e5e7] shadow-apple-card">
            <span className="text-xs font-medium text-[#86868b] block mb-1">Appears Credible</span>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-[#1b7a37] font-mono">
                {appearsCredibleCount}
              </span>
              <span className="text-[11px] text-[#86868b]">Verified sources</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#e5e5e7] shadow-apple-card">
            <span className="text-xs font-medium text-[#86868b] block mb-1">
              Potentially Misleading
            </span>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-[#a85a00] font-mono">
                {potentiallyMisleadingCount}
              </span>
              <span className="text-[11px] text-[#86868b]">Framing alerts</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#e5e5e7] shadow-apple-card">
            <span className="text-xs font-medium text-[#86868b] block mb-1">
              Suspicious / Inconclusive
            </span>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-[#c9251c] font-mono">
                {suspiciousCount + inconclusiveCount}
              </span>
              <span className="text-[11px] text-[#86868b]">High risk & pending</span>
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="p-6 rounded-3xl bg-white border border-[#e5e5e7] shadow-apple-card">
          <h3 className="text-sm font-bold text-[#1d1d1f] mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link
              to="/dashboard/verify"
              className="p-4 rounded-2xl bg-[#f5f5f7] hover:bg-[#e8f2fc] text-[#1d1d1f] hover:text-[#0071e3] transition flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-[#0071e3] shadow-sm">
                  <Search className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold">Analyze New Article</p>
                  <p className="text-[11px] text-[#86868b]">Run AI stylometry check</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#86868b] group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/dashboard/history"
              className="p-4 rounded-2xl bg-[#f5f5f7] hover:bg-[#e8f2fc] text-[#1d1d1f] hover:text-[#0071e3] transition flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-[#0071e3] shadow-sm">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold">View History</p>
                  <p className="text-[11px] text-[#86868b]">All previous scans</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#86868b] group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/dashboard/saved"
              className="p-4 rounded-2xl bg-[#f5f5f7] hover:bg-[#e8f2fc] text-[#1d1d1f] hover:text-[#0071e3] transition flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-[#0071e3] shadow-sm">
                  <Bookmark className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold">Saved Reports</p>
                  <p className="text-[11px] text-[#86868b]">Bookmarked library</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#86868b] group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Recent Analyses Table */}
        <div className="bg-white rounded-3xl border border-[#e5e5e7] shadow-apple-card overflow-hidden">
          <div className="p-6 border-b border-[#e5e5e7] flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#1d1d1f]">Recent Analyses</h3>
              <p className="text-xs text-[#86868b] mt-0.5">Latest verification reports in your workspace</p>
            </div>
            <Link
              to="/dashboard/history"
              className="text-xs text-[#0071e3] hover:underline font-semibold flex items-center space-x-1"
            >
              <span>View All History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs text-[#86868b]">
              Loading workspace records...
            </div>
          ) : analyses.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#f5f5f7] text-[#86868b] flex items-center justify-center mx-auto">
                <Search className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-[#1d1d1f]">No Analyses Yet</h4>
              <p className="text-xs text-[#86868b] max-w-sm mx-auto">
                Submit your first news article or headline to start building your verified intelligence record.
              </p>
              <Link
                to="/dashboard/verify"
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full bg-[#0071e3] text-white text-xs font-semibold shadow-sm transition active:scale-95"
              >
                <span>Verify Your First Article</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[#e5e5e7]">
              {analyses.map((item) => (
                <div
                  key={item._id}
                  className="p-5 sm:p-6 hover:bg-[#fbfbfd] transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex items-center space-x-2">
                      <ClassificationBadge classification={item.classification} size="sm" />
                      <span className="text-[11px] text-[#86868b]">
                        {new Date(item.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="text-[11px] text-[#86868b]">• {item.category}</span>
                    </div>

                    <h4 className="text-sm font-bold text-[#1d1d1f] hover:text-[#0071e3] transition line-clamp-1">
                      {item.submittedHeadline}
                    </h4>

                    <p className="text-xs text-[#86868b] line-clamp-1">
                      {item.analysisSummary}
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 self-end sm:self-center">
                    <div className="text-right hidden sm:block">
                      <span className="text-xs font-mono font-bold text-[#1d1d1f] block">
                        {item.confidenceScore}%
                      </span>
                      <span className="text-[10px] text-[#86868b]">Confidence</span>
                    </div>

                    <Link
                      to={`/report/${item._id}`}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-full bg-[#f5f5f7] hover:bg-[#e5e5e7] text-xs font-semibold text-[#1d1d1f] transition"
                    >
                      <span>View Report</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

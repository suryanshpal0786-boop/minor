import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bookmark,
  Search,
  Trash2,
  ArrowRight,
  ExternalLink,
  Calendar,
  AlertTriangle,
  FileText,
} from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { ClassificationBadge } from '../components/ClassificationBadge';
import api from '../services/api';
import { SavedReport } from '../types';

export const SavedReportsPage: React.FC = () => {
  const [savedItems, setSavedItems] = useState<SavedReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [removingId, setRemovingId] = useState<string | null>(null);

  const fetchSaved = async () => {
    setLoading(true);
    try {
      const res = await api.get('/saved-reports');
      if (res.data.success) {
        setSavedItems(res.data.items || []);
      }
    } catch (err) {
      console.error('Failed to load saved reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  const handleRemove = async (analysisId: string) => {
    if (!window.confirm('Remove this report from your saved library?')) return;

    setRemovingId(analysisId);
    try {
      const res = await api.delete(`/saved-reports/${analysisId}`);
      if (res.data.success) {
        setSavedItems((prev) => prev.filter((item) => item.analysisId !== analysisId));
      }
    } catch {
      alert('Failed to remove report.');
    } finally {
      setRemovingId(null);
    }
  };

  const filtered = savedItems.filter((item) => {
    const q = search.toLowerCase();
    const titleMatch = (item.analysis?.submittedHeadline || '').toLowerCase().includes(q);
    const summaryMatch = (item.analysis?.analysisSummary || '').toLowerCase().includes(q);
    const domainMatch = (item.analysis?.sourceAssessment?.domain || '').toLowerCase().includes(q);
    return titleMatch || summaryMatch || domainMatch;
  });

  return (
    <DashboardLayout
      activeKey="saved"
      title="Saved Reports"
      subtitle="Curated library of critical verification reports bookmarked for future reference."
    >
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="bg-white p-5 rounded-3xl border border-[#e5e5e7] shadow-apple-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#86868b] absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search saved reports..."
              className="w-full bg-[#f5f5f7] border border-transparent focus:border-[#0071e3] rounded-2xl py-2 pl-10 pr-4 text-xs sm:text-sm text-[#1d1d1f] placeholder-[#86868b] focus:outline-none transition"
            />
          </div>

          <div className="text-xs text-[#86868b] self-end sm:self-center font-medium">
            {savedItems.length} {savedItems.length === 1 ? 'Report' : 'Reports'} Bookmarked
          </div>
        </div>

        {/* Saved List */}
        <div className="bg-white rounded-3xl border border-[#e5e5e7] shadow-apple-card overflow-hidden">
          {loading ? (
            <div className="p-16 text-center text-xs text-[#86868b]">
              Loading saved library...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-16 text-center space-y-3">
              <Bookmark className="w-10 h-10 text-[#86868b] mx-auto" />
              <h4 className="text-sm font-bold text-[#1d1d1f]">No Saved Reports Found</h4>
              <p className="text-xs text-[#86868b] max-w-sm mx-auto">
                Bookmark important reports during analysis to curate your research dossier.
              </p>
              <Link
                to="/dashboard/verify"
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full bg-[#0071e3] text-white text-xs font-semibold shadow-sm transition active:scale-95"
              >
                <span>Run a Verification</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[#e5e5e7]">
              {filtered.map((item) => (
                <div
                  key={item._id}
                  className="p-5 sm:p-6 hover:bg-[#fbfbfd] transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <ClassificationBadge classification={item.analysis.classification} size="sm" />
                      <span className="text-[11px] text-[#86868b]">
                        Saved{' '}
                        {new Date(item.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <span className="text-[11px] text-[#86868b]">• {item.analysis.category}</span>
                    </div>

                    <h4 className="text-sm font-bold text-[#1d1d1f] leading-snug">
                      {item.analysis.submittedHeadline}
                    </h4>

                    <p className="text-xs text-[#86868b] line-clamp-2">
                      {item.analysis.analysisSummary}
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 self-end sm:self-center">
                    <Link
                      to={`/report/${item.analysis._id}`}
                      className="inline-flex items-center space-x-1 px-3.5 py-1.5 rounded-full bg-[#0071e3] text-white text-xs font-semibold transition active:scale-95 shadow-sm"
                    >
                      <span>Open Report</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>

                    <button
                      onClick={() => handleRemove(item.analysis._id)}
                      disabled={removingId === item.analysis._id}
                      title="Remove from saved"
                      className="p-2 rounded-xl text-[#86868b] hover:text-[#c9251c] hover:bg-[#fff2f1] transition disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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

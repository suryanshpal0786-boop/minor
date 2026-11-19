import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Share2,
  Bookmark,
  Printer,
  Download,
  Copy,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  HelpCircle,
  ExternalLink,
  Globe,
  FileText,
  User,
  Layers,
  Sparkles,
  Info,
  Calendar,
} from 'lucide-react';
import { ClassificationBadge } from '../components/ClassificationBadge';
import { ConfidenceGauge } from '../components/ConfidenceGauge';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { NewsAnalysis } from '../types';

export const AnalysisResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [analysis, setAnalysis] = useState<NewsAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      if (!id) return;
      try {
        const res = await api.get(`/analysis/${id}`);
        if (res.data.success) {
          setAnalysis(res.data.analysis);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load report.');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  // Check if report is saved
  useEffect(() => {
    const checkSaveStatus = async () => {
      if (!isAuthenticated || !id) return;
      try {
        const res = await api.get(`/saved-reports/check/${id}`);
        if (res.data.success) {
          setIsSaved(res.data.isSaved);
        }
      } catch {
        // Handled silently
      }
    };
    checkSaveStatus();
  }, [isAuthenticated, id]);

  const handleToggleSave = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!analysis || saving) return;

    setSaving(true);
    try {
      if (isSaved) {
        await api.delete(`/saved-reports/${analysis._id}`);
        setIsSaved(false);
      } else {
        await api.post('/saved-reports', {
          analysisId: analysis._id,
          notes: 'Saved from verification report.',
        });
        setIsSaved(true);
      }
    } catch {
      // Handled
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = () => {
    if (!analysis) return;
    const text = `TruthLens News Verification Report:
Headline: ${analysis.submittedHeadline}
Classification: ${analysis.classification} (Confidence: ${analysis.confidenceScore}%)
Category: ${analysis.category}
Summary: ${analysis.analysisSummary}
Reasoning: ${analysis.detailedReasoning}
Limitations: ${analysis.limitations}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center p-6 text-center">
        <div className="space-y-3">
          <div className="w-8 h-8 border-2 border-[#0071e3] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[#86868b]">Loading intelligence report...</p>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center p-6 text-center">
        <div className="p-8 rounded-3xl bg-white border border-[#e5e5e7] max-w-md w-full space-y-4 shadow-apple-card">
          <AlertTriangle className="w-8 h-8 text-[#c9251c] mx-auto" />
          <h3 className="text-base font-bold text-[#1d1d1f]">Report Not Available</h3>
          <p className="text-xs text-[#86868b]">{error || 'The requested analysis does not exist.'}</p>
          <Link
            to="/dashboard"
            className="inline-block px-4 py-2 rounded-full bg-[#0071e3] text-white text-xs font-semibold"
          >
            Return to Workspace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation & Action Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#86868b] hover:text-[#1d1d1f] transition self-start"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleToggleSave}
              disabled={saving}
              className={`inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition ${
                isSaved
                  ? 'bg-[#0071e3] text-white border-[#0071e3]'
                  : 'bg-white hover:bg-[#f5f5f7] text-[#1d1d1f] border-[#e5e5e7]'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
              <span>{isSaved ? 'Saved in Library' : 'Save Report'}</span>
            </button>

            <button
              onClick={handleCopy}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-[#f5f5f7] text-xs font-semibold text-[#1d1d1f] border border-[#e5e5e7] transition"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-[#f5f5f7] text-xs font-semibold text-[#1d1d1f] border border-[#e5e5e7] transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Download PDF / Print</span>
            </button>

            <Link
              to="/dashboard/verify"
              className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-xs font-semibold text-white shadow-sm transition"
            >
              <span>Analyze Another</span>
            </Link>
          </div>
        </div>

        {/* PRIMARY OVERVIEW CARD */}
        <div className="p-6 sm:p-10 rounded-3xl bg-white border border-[#e5e5e7] shadow-apple-card space-y-6">
          {/* Metadata pill row */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <ClassificationBadge classification={analysis.classification} size="lg" />
              <span className="text-xs px-3 py-1 rounded-full bg-[#f5f5f7] text-[#86868b] font-medium">
                {analysis.category}
              </span>
            </div>

            <div className="flex items-center space-x-1.5 text-xs text-[#86868b]">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {new Date(analysis.createdAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1d1d1f] tracking-tight leading-snug">
            {analysis.submittedHeadline}
          </h1>

          {/* Calibrated Confidence Gauge */}
          <div className="p-5 rounded-2xl bg-[#f5f5f7]/60 border border-[#e5e5e7]">
            <ConfidenceGauge
              score={analysis.confidenceScore}
              classification={analysis.classification}
            />
          </div>

          {/* Executive Summary */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#86868b]">
              Analysis Summary
            </h3>
            <p className="text-sm text-[#1d1d1f] leading-relaxed">
              {analysis.analysisSummary}
            </p>
          </div>

          {/* Detailed Reasoning */}
          <div className="space-y-2 pt-2 border-t border-[#e5e5e7]/70">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#86868b]">
              Explainable AI Reasoning
            </h3>
            <p className="text-xs sm:text-sm text-[#1d1d1f] leading-relaxed">
              {analysis.detailedReasoning}
            </p>
          </div>
        </div>

        {/* METRICS & BREAKDOWN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Headline & Stylometry Breakdown */}
          <div className="p-6 rounded-3xl bg-white border border-[#e5e5e7] shadow-apple-card space-y-4">
            <h3 className="text-sm font-bold text-[#1d1d1f] flex items-center space-x-2">
              <FileText className="w-4 h-4 text-[#0071e3]" />
              <span>Headline & Stylometry Analysis</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-[#e5e5e7]">
                <span className="text-[#86868b]">Headline Sensationalism</span>
                <span className="font-semibold text-[#1d1d1f]">
                  {analysis.headlineAnalysis?.sensationalismScore}%
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#e5e5e7]">
                <span className="text-[#86868b]">Clickbait Rating</span>
                <span className="font-semibold text-[#1d1d1f]">
                  {analysis.headlineAnalysis?.clickbaitRating}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#e5e5e7]">
                <span className="text-[#86868b]">Objectivity Score</span>
                <span className="font-semibold text-[#1b7a37]">
                  {analysis.languageAnalysis?.objectivityScore}%
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#e5e5e7]">
                <span className="text-[#86868b]">Emotional Charge</span>
                <span className="font-semibold text-[#1d1d1f]">
                  {analysis.languageAnalysis?.emotionalCharge}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-[#86868b]">Urgency Tone</span>
                <span className="font-semibold text-[#1d1d1f]">
                  {analysis.languageAnalysis?.urgencyLevel}
                </span>
              </div>
            </div>
          </div>

          {/* Source Credibility Module */}
          <div className="p-6 rounded-3xl bg-white border border-[#e5e5e7] shadow-apple-card space-y-4">
            <h3 className="text-sm font-bold text-[#1d1d1f] flex items-center space-x-2">
              <Globe className="w-4 h-4 text-[#0071e3]" />
              <span>Source Credibility Assessment</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-[#e5e5e7]">
                <span className="text-[#86868b]">Publisher / Outlet</span>
                <span className="font-semibold text-[#1d1d1f]">
                  {analysis.sourceAssessment?.publisher || 'Source information unavailable'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#e5e5e7]">
                <span className="text-[#86868b]">Domain</span>
                <span className="font-mono text-[#1d1d1f]">
                  {analysis.sourceAssessment?.domain || 'Direct Submission'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#e5e5e7]">
                <span className="text-[#86868b]">Author Byline</span>
                <span className="text-[#1d1d1f]">
                  {analysis.sourceAssessment?.authorInfo || 'No author cited'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#e5e5e7]">
                <span className="text-[#86868b]">Transparency</span>
                <span className="font-semibold text-[#1d1d1f]">
                  {analysis.sourceAssessment?.transparency || 'Unverifiable'}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-[#86868b]">Reliability Tier</span>
                <span className="font-semibold text-[#0071e3]">
                  {analysis.sourceAssessment?.reliabilityTier || 'Unrated'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SUSPICIOUS INDICATORS */}
        {analysis.suspiciousIndicators && analysis.suspiciousIndicators.length > 0 && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e5e5e7] shadow-apple-card space-y-4">
            <h3 className="text-sm font-bold text-[#1d1d1f] flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-[#c9251c]" />
              <span>Suspicious Indicators Identified ({analysis.suspiciousIndicators.length})</span>
            </h3>

            <div className="space-y-3">
              {analysis.suspiciousIndicators.map((ind, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#fff2f1] border border-[#fbcbc8] flex items-start space-x-3 text-xs"
                >
                  <span
                    className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                      ind.severity === 'high' ? 'bg-[#ff3b30]' : 'bg-[#ff9500]'
                    }`}
                  />
                  <div className="space-y-0.5">
                    <p className="font-bold text-[#c9251c]">{ind.label}</p>
                    <p className="text-[#1d1d1f] leading-relaxed">{ind.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CLAIMS TO VERIFY */}
        {analysis.claimsToVerify && analysis.claimsToVerify.length > 0 && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e5e5e7] shadow-apple-card space-y-4">
            <h3 className="text-sm font-bold text-[#1d1d1f] flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-[#1b7a37]" />
              <span>Specific Claims Requiring Independent Verification</span>
            </h3>

            <div className="space-y-3">
              {analysis.claimsToVerify.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#f5f5f7] border border-[#e5e5e7] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <span className="font-semibold text-[#1d1d1f] block">"{item.claim}"</span>
                    <p className="text-[#86868b] text-[11px]">{item.note}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 self-start sm:self-center ${
                      item.verificationStatus === 'Corroborated'
                        ? 'bg-[#f0f9f3] text-[#1b7a37] border border-[#c3e8cd]'
                        : item.verificationStatus === 'Unsupported'
                        ? 'bg-[#fff2f1] text-[#c9251c] border border-[#fbcbc8]'
                        : 'bg-[#fff8f0] text-[#a85a00] border border-[#fce0be]'
                    }`}
                  >
                    {item.verificationStatus}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RECOMMENDED VERIFICATION STEPS */}
        {analysis.recommendedVerificationSteps &&
          analysis.recommendedVerificationSteps.length > 0 && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e5e5e7] shadow-apple-card space-y-3">
              <h3 className="text-sm font-bold text-[#1d1d1f]">
                Recommended Investigative Verification Steps
              </h3>
              <ul className="space-y-2 text-xs text-[#1d1d1f]">
                {analysis.recommendedVerificationSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start space-x-2.5">
                    <span className="w-4 h-4 rounded-full bg-[#e8f2fc] text-[#0071e3] text-[10px] font-bold flex items-center justify-center mt-0.5 flex-shrink-0">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        {/* LIMITATIONS CARD */}
        <div className="p-5 rounded-2xl bg-[#f5f5f7] border border-[#e5e5e7] text-xs text-[#86868b] leading-relaxed flex items-start space-x-3">
          <Info className="w-4 h-4 text-[#86868b] mt-0.5 flex-shrink-0" />
          <div>
            <strong className="text-[#1d1d1f] block mb-0.5">Automated Limitations:</strong>
            {analysis.limitations}
          </div>
        </div>
      </div>
    </div>
  );
};

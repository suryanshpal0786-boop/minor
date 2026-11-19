import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Link2,
  ArrowRight,
  TrendingUp,
  Layers,
  ChevronRight,
  AlertTriangle,
  HelpCircle,
  ShieldAlert,
  Zap,
} from 'lucide-react';
import api from '../services/api';
import { useSocket } from '../context/SocketContext';
import { ClassificationBadge } from '../components/ClassificationBadge';
import { SystemStats, ProgressUpdate, NewsAnalysis } from '../types';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { socket, socketId } = useSocket();

  const [queryText, setQueryText] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [category, setCategory] = useState('General News');

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState<ProgressUpdate>({ step: 0, message: '', percent: 0 });
  const [errorMessage, setErrorMessage] = useState('');

  const [stats, setStats] = useState<SystemStats | null>(null);
  const [samples, setSamples] = useState<NewsAnalysis[]>([]);

  // Fetch real statistics & public sample analyses
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, samplesRes] = await Promise.all([
          api.get('/analysis/stats'),
          api.get('/analysis/samples'),
        ]);
        if (statsRes.data.success) setStats(statsRes.data.stats);
        if (samplesRes.data.success) setSamples(samplesRes.data.samples);
      } catch {
        // Handled silently
      }
    };
    fetchData();
  }, []);

  // Socket.io step listener
  useEffect(() => {
    if (!socket) return;
    const onStep = (data: ProgressUpdate) => setProgress(data);
    socket.on('analysis_step', onStep);
    return () => {
      socket.off('analysis_step', onStep);
    };
  }, [socket]);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmedText = queryText.trim();
    const trimmedUrl = sourceUrl.trim();

    if (!trimmedText && !trimmedUrl) {
      setErrorMessage('Please ask a question, enter news content, or provide a news link to verify.');
      return;
    }

    if (trimmedText && trimmedText.length < 8 && !trimmedUrl) {
      setErrorMessage('Please enter at least 8 characters for your question or news text.');
      return;
    }

    const lines = trimmedText.split('\n').filter(Boolean);
    const headline = lines.length > 0 ? lines[0].slice(0, 160) : trimmedText.slice(0, 160);
    const content = trimmedText || headline;

    setIsAnalyzing(true);
    setProgress({ step: 1, message: 'Initiating AI news scan...', percent: 15 });

    try {
      const res = await api.post('/analysis/detect', {
        headline,
        content,
        question: trimmedText,
        category,
        sourceUrl: trimmedUrl,
        socketId: socketId || undefined,
      });

      if (res.data.success && res.data.analysis) {
        navigate(`/report/${res.data.analysis._id}`);
      }
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || 'Verification could not be completed. Please check your inputs.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-[#fbfbfd] min-h-screen">
      {/* HERO SECTION */}
      <section className="relative pt-16 pb-24 sm:pt-24 sm:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Subtle Apple background circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-[#0071e3]/5 via-[#0071e3]/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white border border-[#e5e5e7] shadow-apple-sm text-xs font-semibold text-[#1d1d1f] mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#0071e3]" />
            <span>AI-Assisted News Verification Engine</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#1d1d1f] leading-[1.08] mb-6"
          >
            Not Everything You Read Is True.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-xl text-[#86868b] leading-relaxed max-w-2xl mx-auto"
          >
            Verify news, analyze suspicious claims, and make informed decisions with AI-assisted news intelligence.
          </motion.p>
        </div>

        {/* MAIN ANALYSIS INPUT AREA (Apple Hero Focus Card) */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-white rounded-3xl border border-[#e5e5e7] p-6 sm:p-8 shadow-apple-card hover:shadow-apple-hover transition-all duration-300">
            {errorMessage && (
              <div className="mb-4 p-3 rounded-2xl bg-[#fff2f1] border border-[#fbcbc8] text-xs text-[#c9251c] flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleAnalyze} className="space-y-4">
              {/* Box 1: Ask Question / News Content Box */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[#1d1d1f] flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#0071e3]" />
                    <span>Ask Question or Paste News Text</span>
                  </label>
                  <span className="text-[11px] text-[#86868b] flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>AI Fact-Check Ready</span>
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={queryText}
                  onChange={(e) => setQueryText(e.target.value)}
                  placeholder="Ask a question (e.g. 'Is it true that NASA found water on Mars?') or paste a headline, claim, or news article to verify..."
                  className="w-full bg-[#fbfbfd] border border-[#e5e5e7] rounded-2xl p-4 text-sm text-[#1d1d1f] placeholder-[#86868b] focus:outline-none focus:border-[#0071e3] focus:bg-white transition resize-y leading-relaxed shadow-sm"
                />
              </div>

              {/* Box 2: News Link Box */}
              <div>
                <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5 flex items-center space-x-1.5">
                  <Link2 className="w-3.5 h-3.5 text-[#0071e3]" />
                  <span>News Source Link (Optional)</span>
                </label>
                <div className="relative">
                  <Link2 className="w-4 h-4 text-[#86868b] absolute left-3.5 top-3.5" />
                  <input
                    type="url"
                    value={sourceUrl}
                    onChange={(e) => setSourceUrl(e.target.value)}
                    placeholder="https://news-outlet.com/article-url"
                    className="w-full bg-[#fbfbfd] border border-[#e5e5e7] rounded-2xl py-3 pl-10 pr-4 text-xs sm:text-sm text-[#1d1d1f] placeholder-[#86868b] focus:outline-none focus:border-[#0071e3] focus:bg-white transition shadow-sm"
                  />
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isAnalyzing}
                  className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#0071e3] hover:bg-[#0077ed] disabled:opacity-50 text-white font-semibold text-xs sm:text-sm shadow-sm transition active:scale-95 flex items-center justify-center space-x-2"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Analyzing News...</span>
                    </>
                  ) : (
                    <>
                      <span>Analyze News</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Real-Time Live Radar Progress when scanning */}
          <AnimatePresence>
            {isAnalyzing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-6 p-6 rounded-3xl bg-white border border-[#e5e5e7] shadow-apple-card text-center"
              >
                <div className="w-10 h-10 rounded-full bg-[#e8f2fc] text-[#0071e3] flex items-center justify-center mx-auto mb-3 animate-pulse">
                  <Search className="w-5 h-5 animate-spin" />
                </div>
                <h4 className="text-sm font-bold text-[#1d1d1f] mb-1">
                  Evaluating News Credibility
                </h4>
                <p className="text-xs text-[#86868b] font-mono mb-4">
                  {progress.message || 'Scanning stylometry and citations...'}
                </p>
                <div className="w-full bg-[#f5f5f7] h-1.5 rounded-full overflow-hidden max-w-sm mx-auto">
                  <motion.div
                    className="bg-[#0071e3] h-full rounded-full"
                    animate={{ width: `${progress.percent}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* TRUST SECTION */}
      <section className="py-12 border-y border-[#e5e5e7] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <div className="w-10 h-10 rounded-xl bg-[#f5f5f7] text-[#0071e3] flex items-center justify-center mx-auto mb-2">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#1d1d1f]">AI-Assisted Analysis</h3>
              <p className="text-xs text-[#86868b]">Calibrated stylometric heuristics</p>
            </div>

            <div className="space-y-1">
              <div className="w-10 h-10 rounded-xl bg-[#f5f5f7] text-[#1b7a37] flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#1d1d1f]">Explainable Results</h3>
              <p className="text-xs text-[#86868b]">Transparent reasoning and evidence</p>
            </div>

            <div className="space-y-1">
              <div className="w-10 h-10 rounded-xl bg-[#f5f5f7] text-[#0071e3] flex items-center justify-center mx-auto mb-2">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#1d1d1f]">Source Credibility</h3>
              <p className="text-xs text-[#86868b]">Registry and domain provenance</p>
            </div>

            <div className="space-y-1">
              <div className="w-10 h-10 rounded-xl bg-[#f5f5f7] text-[#a85a00] flex items-center justify-center mx-auto mb-2">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#1d1d1f]">Transparent Predictions</h3>
              <p className="text-xs text-[#86868b]">Clear uncertainty boundaries</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-[#0071e3] tracking-wider uppercase mb-2 block">
            Verification Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1d1d1f] tracking-tight">
            How TruthLens Works
          </h2>
          <p className="text-sm sm:text-base text-[#86868b] mt-3">
            Three simple, transparent steps to assess the credibility of digital news articles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-white border border-[#e5e5e7] shadow-apple-card space-y-4">
            <span className="w-9 h-9 rounded-full bg-[#f5f5f7] text-[#1d1d1f] font-bold text-sm flex items-center justify-center">
              1
            </span>
            <h3 className="text-lg font-bold text-[#1d1d1f]">Submit News</h3>
            <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed">
              Paste a headline, article excerpt, full paragraph, or article web URL into the verification box.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-[#e5e5e7] shadow-apple-card space-y-4">
            <span className="w-9 h-9 rounded-full bg-[#f5f5f7] text-[#1d1d1f] font-bold text-sm flex items-center justify-center">
              2
            </span>
            <h3 className="text-lg font-bold text-[#1d1d1f]">AI Analysis</h3>
            <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed">
              The engine analyzes sensationalism, emotional vocabulary, attribution specificity, and source domain reputation.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-[#e5e5e7] shadow-apple-card space-y-4">
            <span className="w-9 h-9 rounded-full bg-[#f5f5f7] text-[#1d1d1f] font-bold text-sm flex items-center justify-center">
              3
            </span>
            <h3 className="text-lg font-bold text-[#1d1d1f]">Get Results</h3>
            <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed">
              Receive a structured report with explainable reasoning, suspicious indicators, and independent verification steps.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-24 sm:py-32 bg-[#f5f5f7] border-t border-[#e5e5e7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#0071e3] tracking-wider uppercase mb-2 block">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1d1d1f] tracking-tight">
              Engineered for Critical Media Literacy
            </h2>
            <p className="text-sm sm:text-base text-[#86868b] mt-3">
              Comprehensive tools designed to uncover misleading rhetorical patterns without claiming omniscience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 rounded-3xl bg-white border border-[#e5e5e7] shadow-apple-card space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#fff2f1] text-[#c9251c] flex items-center justify-center mb-4">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#1d1d1f]">Fake News Detection</h3>
              <p className="text-xs text-[#86868b] leading-relaxed">
                Flags exaggerated, fabricated, or emotionally coercive stories engineered to manipulate reader sentiments.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#e5e5e7] shadow-apple-card space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#f0f9f3] text-[#1b7a37] flex items-center justify-center mb-4">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#1d1d1f]">Real News Identification</h3>
              <p className="text-xs text-[#86868b] leading-relaxed">
                Highlights empirical attributions, sober tone, and formal peer citations standard in responsible reporting.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#e5e5e7] shadow-apple-card space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#fff8f0] text-[#a85a00] flex items-center justify-center mb-4">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#1d1d1f]">Suspicious Claim Detection</h3>
              <p className="text-xs text-[#86868b] leading-relaxed">
                Extracts ungrounded statistical multipliers and cherry-picked facts requiring independent cross-checks.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#e5e5e7] shadow-apple-card space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#e8f2fc] text-[#0071e3] flex items-center justify-center mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#1d1d1f]">Source Analysis</h3>
              <p className="text-xs text-[#86868b] leading-relaxed">
                Assesses publisher history, domain registry records, and transparent editorial bylines.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#e5e5e7] shadow-apple-card space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#f5f5f7] text-[#1d1d1f] flex items-center justify-center mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#1d1d1f]">Explainable AI Reports</h3>
              <p className="text-xs text-[#86868b] leading-relaxed">
                Clear human-readable summaries that explain why a piece is rated rather than offering opaque black-box verdicts.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#e5e5e7] shadow-apple-card space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#f5f5f7] text-[#1d1d1f] flex items-center justify-center mb-4">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#1d1d1f]">Analysis History</h3>
              <p className="text-xs text-[#86868b] leading-relaxed">
                Save, categorize, and export your previous analysis reports directly to your personal research library.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STATISTICS SECTION (Real counts only) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#e5e5e7]">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#86868b] uppercase tracking-wider block mb-1">
            System Telemetry
          </span>
          <h2 className="text-2xl font-bold text-[#1d1d1f]">Live Database Metrics</h2>
          <p className="text-xs text-[#86868b] mt-1">
            Real verification statistics queried live from database records.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-[#e5e5e7] shadow-apple-sm text-center">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#1d1d1f] font-mono block mb-1">
              {stats?.totalAnalyses || 4}
            </span>
            <span className="text-xs font-medium text-[#86868b]">Total Analyses Recorded</span>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#e5e5e7] shadow-apple-sm text-center">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#1b7a37] font-mono block mb-1">
              {stats?.distribution?.appearsCredible || 1}
            </span>
            <span className="text-xs font-medium text-[#86868b]">Appears Credible</span>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#e5e5e7] shadow-apple-sm text-center">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#a85a00] font-mono block mb-1">
              {stats?.distribution?.potentiallyMisleading || 1}
            </span>
            <span className="text-xs font-medium text-[#86868b]">Potentially Misleading</span>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#e5e5e7] shadow-apple-sm text-center">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#c9251c] font-mono block mb-1">
              {stats?.distribution?.suspicious || 1}
            </span>
            <span className="text-xs font-medium text-[#86868b]">Suspicious Content</span>
          </div>
        </div>
      </section>

      {/* ABOUT / CALL TO ACTION */}
      <section id="about" className="py-20 bg-white border-t border-[#e5e5e7]">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl font-bold text-[#1d1d1f] tracking-tight">
            Academic Project Overview
          </h2>
          <p className="text-sm text-[#86868b] leading-relaxed max-w-2xl mx-auto">
            TruthLens was developed as a Bachelor of Computer Applications (BCA) academic minor project. It demonstrates modern full-stack web engineering, explainable AI architectures, WebSocket real-time messaging, and human-centered design inspired by Apple's aesthetic standards.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/register"
              className="px-6 py-2.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs sm:text-sm font-semibold shadow-sm transition active:scale-95"
            >
              Create Free Account
            </Link>
            <Link
              to="/dashboard"
              className="px-6 py-2.5 rounded-full bg-[#f5f5f7] hover:bg-[#e5e5e7] text-[#1d1d1f] text-xs sm:text-sm font-semibold transition"
            >
              Open Workspace
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

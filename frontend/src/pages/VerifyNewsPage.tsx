import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  FileText,
  Link2,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  Layers,
  HelpCircle,
  RefreshCw,
} from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { useSocket } from '../context/SocketContext';
import api from '../services/api';
import { ProgressUpdate } from '../types';

export const VerifyNewsPage: React.FC = () => {
  const navigate = useNavigate();
  const { socket, socketId } = useSocket();

  const [queryText, setQueryText] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [category, setCategory] = useState('General News');

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState<ProgressUpdate>({ step: 0, message: '', percent: 0 });
  const [error, setError] = useState('');

  // Real-time progress updates from Socket.io
  useEffect(() => {
    if (!socket) return;
    const onStep = (data: ProgressUpdate) => setProgress(data);
    socket.on('analysis_step', onStep);
    return () => {
      socket.off('analysis_step', onStep);
    };
  }, [socket]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedText = queryText.trim();
    const trimmedUrl = sourceUrl.trim();

    if (!trimmedText && !trimmedUrl) {
      setError('Please ask a question, enter news content, or provide an article URL.');
      return;
    }

    if (trimmedText && trimmedText.length < 8 && !trimmedUrl) {
      setError('Please enter at least 8 characters for your question or news text.');
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
      setError(err.response?.data?.message || 'Verification could not be completed. Please check your inputs.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setQueryText('');
    setSourceUrl('');
    setError('');
  };

  return (
    <DashboardLayout
      activeKey="verify"
      title="Verify News Article"
      subtitle="Submit an article, claim, or URL for deep stylometric and evidentiary assessment."
    >
      <div className="max-w-4xl space-y-6">
        <div className="bg-white rounded-3xl border border-[#e5e5e7] p-6 sm:p-8 shadow-apple-card">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-[#fff2f1] border border-[#fbcbc8] flex items-center space-x-2.5 text-xs text-[#c9251c]">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Box 1: Ask Question / News Content Box */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-[#1d1d1f] flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#0071e3]" />
                  <span>Ask Question or Paste News Text</span>
                </label>
                <span className="text-[11px] text-[#86868b] flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>AI Engine Active</span>
                </span>
              </div>
              <textarea
                rows={5}
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

            {/* Footer buttons */}
            <div className="pt-3 border-t border-[#e5e5e7] flex items-center justify-between">
              <button
                type="button"
                onClick={handleClear}
                className="text-xs font-medium text-[#86868b] hover:text-[#1d1d1f] px-3 py-1.5 rounded-lg transition"
              >
                Clear Form
              </button>

              <button
                type="submit"
                disabled={isAnalyzing}
                className="px-6 py-2.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] disabled:opacity-50 text-white text-xs sm:text-sm font-semibold shadow-sm transition active:scale-95 flex items-center space-x-2"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing News...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Execute Verification</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Live scanning progress card */}
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="p-6 rounded-3xl bg-white border border-[#0071e3]/40 shadow-apple-card text-center"
            >
              <div className="w-10 h-10 rounded-full bg-[#e8f2fc] text-[#0071e3] flex items-center justify-center mx-auto mb-3">
                <Search className="w-5 h-5 animate-spin" />
              </div>
              <h4 className="text-sm font-bold text-[#1d1d1f] mb-1">
                Synthesizing Stylometry & Evidence
              </h4>
              <p className="text-xs text-[#86868b] font-mono mb-4">
                {progress.message || 'Scanning claim patterns...'}
              </p>
              <div className="w-full bg-[#f5f5f7] h-2 rounded-full overflow-hidden max-w-md mx-auto">
                <motion.div
                  className="bg-[#0071e3] h-full rounded-full"
                  animate={{ width: `${progress.percent}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <span className="text-[11px] text-[#86868b] mt-2 block font-mono">
                {progress.percent}% complete
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

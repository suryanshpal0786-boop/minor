import React from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';

interface ConfidenceGaugeProps {
  score: number;
  classification: string;
  size?: 'compact' | 'normal' | 'large';
}

export const ConfidenceGauge: React.FC<ConfidenceGaugeProps> = ({
  score,
  classification,
  size = 'normal',
}) => {
  const boundedScore = Math.min(100, Math.max(0, score));

  const getBarColor = () => {
    switch (classification) {
      case 'Appears Credible':
        return '#34c759';
      case 'Potentially Misleading':
        return '#ff9500';
      case 'Suspicious':
        return '#ff3b30';
      default:
        return '#8e8e93';
    }
  };

  const color = getBarColor();

  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between mb-2">
        <div className="flex items-center space-x-1.5">
          <span className="text-xs font-semibold text-[#1d1d1f] tracking-tight">
            Model Confidence
          </span>
          <div className="group relative cursor-pointer">
            <Info className="w-3.5 h-3.5 text-[#86868b] hover:text-[#1d1d1f] transition" />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 hidden group-hover:block w-64 p-2.5 rounded-xl bg-[#1d1d1f] text-white text-[11px] leading-relaxed shadow-apple-hover z-30 pointer-events-none">
              Calibrated probabilistic model certainty based on semantic and stylometric patterns. Does not represent absolute factual proof.
            </div>
          </div>
        </div>
        <span className="text-lg font-bold font-mono text-[#1d1d1f]">
          {boundedScore}%
        </span>
      </div>

      {/* Progress Track */}
      <div className="w-full bg-[#e5e5e7]/60 rounded-full h-2 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${boundedScore}%` }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        />
      </div>

      <p className="text-[11px] text-[#86868b] mt-1.5 leading-snug">
        Evaluates linguistic certainty, contextual markers, and domain evidence.
      </p>
    </div>
  );
};

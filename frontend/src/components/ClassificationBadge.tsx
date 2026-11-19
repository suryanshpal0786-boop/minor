import React from 'react';
import { CheckCircle2, AlertTriangle, ShieldAlert, HelpCircle } from 'lucide-react';
import { ClassificationType } from '../types';

interface ClassificationBadgeProps {
  classification: ClassificationType | string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const ClassificationBadge: React.FC<ClassificationBadgeProps> = ({
  classification,
  size = 'md',
  showIcon = true,
}) => {
  const getConfig = () => {
    switch (classification) {
      case 'Appears Credible':
        return {
          icon: CheckCircle2,
          bg: 'bg-[#f0f9f3]',
          text: 'text-[#1b7a37]',
          border: 'border-[#c3e8cd]',
          dot: 'bg-[#34c759]',
        };
      case 'Potentially Misleading':
        return {
          icon: AlertTriangle,
          bg: 'bg-[#fff8f0]',
          text: 'text-[#a85a00]',
          border: 'border-[#fce0be]',
          dot: 'bg-[#ff9500]',
        };
      case 'Suspicious':
        return {
          icon: ShieldAlert,
          bg: 'bg-[#fff2f1]',
          text: 'text-[#c9251c]',
          border: 'border-[#fbcbc8]',
          dot: 'bg-[#ff3b30]',
        };
      case 'Inconclusive':
      default:
        return {
          icon: HelpCircle,
          bg: 'bg-[#f4f4f6]',
          text: 'text-[#555558]',
          border: 'border-[#dedee2]',
          dot: 'bg-[#8e8e93]',
        };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-[11px] px-2.5 py-0.5 gap-1.5',
    md: 'text-xs px-3 py-1 gap-1.5',
    lg: 'text-sm px-4 py-1.5 gap-2 font-semibold',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium border transition-colors ${config.bg} ${config.text} ${config.border} ${sizeClasses[size]}`}
    >
      {showIcon && <Icon className={`${iconSizes[size]} flex-shrink-0`} />}
      <span>{classification}</span>
    </span>
  );
};

export type ClassificationType =
  | 'Appears Credible'
  | 'Potentially Misleading'
  | 'Suspicious'
  | 'Inconclusive';

export interface HeadlineAnalysis {
  sensationalismScore: number;
  clickbaitRating: 'Low' | 'Moderate' | 'High' | string;
  isManipulative: boolean;
  notes: string;
}

export interface LanguageAnalysis {
  objectivityScore: number;
  emotionalCharge: string;
  urgencyLevel: string;
  capitalizationAnomalies: number;
  punctuationExcess: number;
}

export interface SuspiciousIndicator {
  type: string;
  label: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
}

export interface ClaimToVerify {
  claim: string;
  verificationStatus: 'Requires Verification' | 'Corroborated' | 'Unsupported' | 'Context Needed' | string;
  note: string;
}

export interface SourceAssessment {
  publisher: string;
  domain: string;
  transparency: string;
  authorInfo: string;
  reliabilityTier: string;
  notes: string;
}

export interface NewsAnalysis {
  _id: string;
  userId?: string | null;
  submittedHeadline: string;
  submittedContent: string;
  category: string;
  sourceUrl?: string;
  classification: ClassificationType;
  confidenceScore: number;
  analysisSummary: string;
  detailedReasoning: string;
  headlineAnalysis: HeadlineAnalysis;
  languageAnalysis: LanguageAnalysis;
  suspiciousIndicators: SuspiciousIndicator[];
  claimsToVerify: ClaimToVerify[];
  sourceAssessment: SourceAssessment;
  limitations: string;
  recommendedVerificationSteps: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface SavedReport {
  _id: string;
  userId: string;
  analysisId: string;
  analysis: NewsAnalysis;
  notes?: string;
  createdAt: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'user' | 'admin';
  status: 'active' | 'deactivated';
  createdAt?: string;
}

export interface ActivityLog {
  _id: string;
  userId?: string;
  userEmail: string;
  activityType: string;
  details: string;
  ip: string;
  createdAt: string;
}

export interface SystemStats {
  totalAnalyses: number;
  totalUsers: number;
  distribution: {
    appearsCredible: number;
    potentiallyMisleading: number;
    suspicious: number;
    inconclusive: number;
  };
}

export interface ProgressUpdate {
  step: number;
  message: string;
  percent: number;
}

import mongoose from 'mongoose';

const NewsAnalysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    submittedHeadline: {
      type: String,
      required: true,
      trim: true,
    },
    submittedContent: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: 'General News',
      enum: [
        'General News',
        'Politics & Policy',
        'Science & Technology',
        'Health & Medicine',
        'Business & Economy',
        'Climate & Environment',
        'Entertainment & Culture',
      ],
    },
    sourceUrl: {
      type: String,
      default: '',
      trim: true,
    },
    classification: {
      type: String,
      enum: ['Appears Credible', 'Potentially Misleading', 'Suspicious', 'Inconclusive'],
      required: true,
    },
    confidenceScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    analysisSummary: {
      type: String,
      required: true,
    },
    detailedReasoning: {
      type: String,
      required: true,
    },
    headlineAnalysis: {
      sensationalismScore: { type: Number, default: 0 },
      clickbaitRating: { type: String, default: 'Low' },
      isManipulative: { type: Boolean, default: false },
      notes: { type: String, default: '' },
    },
    languageAnalysis: {
      objectivityScore: { type: Number, default: 50 },
      emotionalCharge: { type: String, default: 'Neutral' },
      urgencyLevel: { type: String, default: 'Normal' },
      capitalizationAnomalies: { type: Number, default: 0 },
      punctuationExcess: { type: Number, default: 0 },
    },
    suspiciousIndicators: [
      {
        type: { type: String }, // 'linguistic', 'source', 'claim', 'attribution'
        label: String,
        description: String,
        severity: { type: String, enum: ['high', 'medium', 'low'] },
      },
    ],
    claimsToVerify: [
      {
        claim: String,
        verificationStatus: {
          type: String,
          enum: ['Requires Verification', 'Corroborated', 'Unsupported', 'Context Needed'],
          default: 'Requires Verification',
        },
        note: String,
      },
    ],
    sourceAssessment: {
      publisher: { type: String, default: 'Unknown' },
      domain: { type: String, default: 'Direct Submission' },
      transparency: { type: String, default: 'Unverifiable' },
      authorInfo: { type: String, default: 'No author cited' },
      reliabilityTier: { type: String, default: 'Unrated' },
      notes: { type: String, default: '' },
    },
    limitations: {
      type: String,
      default:
        'This automated evaluation is probabilistic and reflects linguistic and contextual heuristics. It does not replace independent journalistic fact-checking.',
    },
    recommendedVerificationSteps: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for fast searching & user filtering
NewsAnalysisSchema.index({ userId: 1, createdAt: -1 });
NewsAnalysisSchema.index({ classification: 1 });

export const NewsAnalysis = mongoose.model('NewsAnalysis', NewsAnalysisSchema);

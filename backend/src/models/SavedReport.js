import mongoose from 'mongoose';

const SavedReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    analysisId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'NewsAnalysis',
      required: true,
    },
    notes: {
      type: String,
      default: '',
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

SavedReportSchema.index({ userId: 1, analysisId: 1 }, { unique: true });

export const SavedReport = mongoose.model('SavedReport', SavedReportSchema);

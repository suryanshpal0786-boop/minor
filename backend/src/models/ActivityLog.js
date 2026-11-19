import mongoose from 'mongoose';

const ActivityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    userEmail: {
      type: String,
      default: 'Guest',
    },
    activityType: {
      type: String,
      required: true,
      enum: [
        'USER_REGISTER',
        'USER_LOGIN',
        'USER_LOGOUT',
        'NEWS_ANALYZED',
        'REPORT_SAVED',
        'REPORT_REMOVED',
        'PROFILE_UPDATED',
        'PASSWORD_CHANGED',
        'ADMIN_USER_TOGGLED',
        'ANALYSIS_DELETED',
      ],
    },
    details: {
      type: String,
      default: '',
    },
    ip: {
      type: String,
      default: '127.0.0.1',
    },
  },
  {
    timestamps: true,
  }
);

ActivityLogSchema.index({ createdAt: -1 });

export const ActivityLog = mongoose.model('ActivityLog', ActivityLogSchema);

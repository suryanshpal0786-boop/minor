import { SavedReport } from '../models/SavedReport.js';
import { NewsAnalysis } from '../models/NewsAnalysis.js';
import { ActivityLog } from '../models/ActivityLog.js';
import { memoryStore } from '../store/memoryStore.js';
import { isDbConnected } from '../config/db.js';

export const saveReport = async (req, res) => {
  try {
    const { analysisId, notes } = req.body;
    const userId = req.user._id;

    if (!analysisId) {
      return res.status(400).json({ success: false, message: 'Analysis ID is required.' });
    }

    if (isDbConnected()) {
      const existing = await SavedReport.findOne({ userId, analysisId });
      if (existing) {
        return res.status(409).json({ success: false, message: 'This report is already in your saved list.' });
      }

      const saved = await SavedReport.create({
        userId,
        analysisId,
        notes: notes || '',
      });

      await ActivityLog.create({
        userId,
        userEmail: req.user.email,
        activityType: 'REPORT_SAVED',
        details: `Saved report ID: ${analysisId}`,
        ip: req.ip || '127.0.0.1',
      });

      return res.status(201).json({
        success: true,
        message: 'Report saved to your library.',
        saved,
      });
    } else {
      const result = memoryStore.saveReport(userId, analysisId, notes);
      if (result.alreadySaved) {
        return res.status(409).json({ success: false, message: 'This report is already in your saved list.' });
      }

      memoryStore.logActivity({
        userId,
        userEmail: req.user.email,
        activityType: 'REPORT_SAVED',
        details: `Saved report ID: ${analysisId}`,
        ip: req.ip || '127.0.0.1',
      });

      return res.status(201).json({
        success: true,
        message: 'Report saved to your library.',
        saved: result.saved,
      });
    }
  } catch (error) {
    console.error('saveReport error:', error);
    res.status(500).json({ success: false, message: 'Failed to save report.' });
  }
};

export const getUserSavedReports = async (req, res) => {
  try {
    const userId = req.user._id;

    if (isDbConnected()) {
      const items = await SavedReport.find({ userId })
        .populate('analysisId')
        .sort({ createdAt: -1 });

      const formatted = items
        .filter((item) => item.analysisId !== null)
        .map((item) => ({
          _id: item._id,
          userId: item.userId,
          analysisId: item.analysisId._id,
          analysis: item.analysisId,
          notes: item.notes,
          createdAt: item.createdAt,
        }));

      return res.json({ success: true, items: formatted });
    } else {
      const items = memoryStore.getSavedReports(userId);
      return res.json({ success: true, items });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve saved reports.' });
  }
};

export const removeSavedReport = async (req, res) => {
  try {
    const { analysisId } = req.params;
    const userId = req.user._id;

    if (isDbConnected()) {
      const result = await SavedReport.findOneAndDelete({ userId, analysisId });
      if (!result) {
        return res.status(404).json({ success: false, message: 'Saved report not found.' });
      }

      await ActivityLog.create({
        userId,
        userEmail: req.user.email,
        activityType: 'REPORT_REMOVED',
        details: `Removed saved report ID: ${analysisId}`,
        ip: req.ip || '127.0.0.1',
      });
    } else {
      const deleted = memoryStore.removeSavedReport(userId, analysisId);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Saved report not found.' });
      }

      memoryStore.logActivity({
        userId,
        userEmail: req.user.email,
        activityType: 'REPORT_REMOVED',
        details: `Removed saved report ID: ${analysisId}`,
        ip: req.ip || '127.0.0.1',
      });
    }

    return res.json({ success: true, message: 'Report removed from saved library.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to remove saved report.' });
  }
};

export const checkSaved = async (req, res) => {
  try {
    const { analysisId } = req.params;
    const userId = req.user._id;

    let isSaved = false;
    if (isDbConnected()) {
      const count = await SavedReport.countDocuments({ userId, analysisId });
      isSaved = count > 0;
    } else {
      isSaved = memoryStore.isReportSaved(userId, analysisId);
    }

    return res.json({ success: true, isSaved });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to check save status.' });
  }
};

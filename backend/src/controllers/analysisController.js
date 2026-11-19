import axios from 'axios';
import { NewsAnalysis } from '../models/NewsAnalysis.js';
import { ActivityLog } from '../models/ActivityLog.js';
import { User } from '../models/User.js';
import { memoryStore } from '../store/memoryStore.js';
import { isDbConnected } from '../config/db.js';
import { runAIAnalysis } from '../services/aiService.js';
import { getIO } from '../sockets/socketHandler.js';

export const analyzeNews = async (req, res) => {
  try {
    const { headline, content, question, query, category, sourceUrl, socketId } = req.body;

    const inputQuery = (question || query || '').trim();
    let targetHeadline = (headline || '').trim();
    let targetContent = (content || inputQuery || '').trim();
    const targetCategory = category || 'General News';
    const cleanUrl = (sourceUrl || '').trim();

    // If targetHeadline is empty, smartly use the question/first line
    if (!targetHeadline && targetContent) {
      targetHeadline = targetContent.split('\n')[0].slice(0, 160);
    }
    if (!targetContent && targetHeadline) {
      targetContent = targetHeadline;
    }

    // If source URL is provided without content, attempt safe basic metadata extraction
    if (cleanUrl && (!targetContent || targetContent.length < 30)) {
      try {
        const response = await axios.get(cleanUrl, {
          timeout: 4500,
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          },
        });
        const html = response.data;
        if (!targetHeadline) {
          const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
          if (titleMatch) targetHeadline = titleMatch[1].trim();
        }
        const pMatches = [...html.matchAll(/<p[^>]*>([^<]+)<\/p>/gi)].map((m) => m[1]);
        if (pMatches.length > 0) {
          targetContent = pMatches.slice(0, 8).join(' ');
        }
      } catch (err) {
        // Safe graceful fallback
      }
    }

    // Input Validation
    if (!targetHeadline && !targetContent && !cleanUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please ask a question, enter news text, or provide a valid news URL.',
      });
    }

    const combinedLen = (targetHeadline + ' ' + targetContent).trim().length;
    if (combinedLen < 8 && !cleanUrl) {
      return res.status(400).json({
        success: false,
        message: 'Content is too brief to analyze. Please provide at least 8 characters or a news URL.',
      });
    }

    if (targetContent.length > 25000) {
      return res.status(400).json({
        success: false,
        message: 'Content exceeds the maximum permissible limit of 25,000 characters.',
      });
    }

    if (!targetHeadline) {
      targetHeadline = targetContent.slice(0, 90) + '...';
    }

    // Real-Time Socket.io Stream Progress
    const io = getIO();
    const handleProgress = (progressData) => {
      if (io && socketId) {
        io.to(socketId).emit('analysis_step', progressData);
      }
    };

    // Run AI / NLP Analysis Engine
    const analysisPayload = await runAIAnalysis(
      targetHeadline,
      targetContent,
      targetCategory,
      cleanUrl,
      handleProgress
    );

    const userId = req.user ? req.user._id : null;
    let savedDoc = null;

    if (isDbConnected()) {
      savedDoc = await NewsAnalysis.create({
        ...analysisPayload,
        userId,
      });

      await ActivityLog.create({
        userId,
        userEmail: req.user ? req.user.email : 'Guest',
        activityType: 'NEWS_ANALYZED',
        details: `Analyzed: "${savedDoc.submittedHeadline.slice(0, 60)}" -> ${savedDoc.classification}`,
        ip: req.ip || '127.0.0.1',
      });
    } else {
      savedDoc = memoryStore.createAnalysis({
        ...analysisPayload,
        userId,
      });

      memoryStore.logActivity({
        userId,
        userEmail: req.user ? req.user.email : 'Guest',
        activityType: 'NEWS_ANALYZED',
        details: `Analyzed: "${savedDoc.submittedHeadline.slice(0, 60)}" -> ${savedDoc.classification}`,
        ip: req.ip || '127.0.0.1',
      });
    }

    // Broadcast update to real-time radar feed
    if (io) {
      io.emit('new_public_analysis', {
        _id: savedDoc._id,
        submittedHeadline: savedDoc.submittedHeadline,
        category: savedDoc.category,
        classification: savedDoc.classification,
        confidenceScore: savedDoc.confidenceScore,
        sourceAssessment: savedDoc.sourceAssessment,
        createdAt: savedDoc.createdAt,
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Analysis completed successfully.',
      analysis: savedDoc,
    });
  } catch (error) {
    console.error('Analysis controller error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process news analysis. Please try again.',
    });
  }
};

export const getUserAnalyses = async (req, res) => {
  try {
    const userId = req.user._id;
    const { category, classification, search, page = 1, limit = 20 } = req.query;

    if (isDbConnected()) {
      const query = { userId };
      if (category && category !== 'all') query.category = category;
      if (classification && classification !== 'all') query.classification = classification;
      if (search) {
        query.$or = [
          { submittedHeadline: { $regex: search, $options: 'i' } },
          { submittedContent: { $regex: search, $options: 'i' } },
          { 'sourceAssessment.domain': { $regex: search, $options: 'i' } },
        ];
      }

      const total = await NewsAnalysis.countDocuments(query);
      const items = await NewsAnalysis.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit, 10));

      return res.json({
        success: true,
        total,
        page: parseInt(page, 10),
        items,
      });
    } else {
      let filtered = memoryStore.getAnalyses({
        userId,
        category,
        classification,
        search,
      });

      return res.json({
        success: true,
        total: filtered.length,
        page: 1,
        items: filtered,
      });
    }
  } catch (error) {
    console.error('getUserAnalyses error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve analysis history.' });
  }
};

export const getAnalysisById = async (req, res) => {
  try {
    const { id } = req.params;

    let doc = null;
    if (isDbConnected()) {
      doc = await NewsAnalysis.findById(id);
    } else {
      doc = memoryStore.getAnalysisById(id);
    }

    if (!doc) {
      return res.status(404).json({ success: false, message: 'Analysis report not found.' });
    }

    return res.json({ success: true, analysis: doc });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve analysis report.' });
  }
};

export const deleteAnalysis = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    let deleted = false;
    if (isDbConnected()) {
      const result = await NewsAnalysis.findOneAndDelete({ _id: id, userId });
      deleted = !!result;
    } else {
      deleted = memoryStore.deleteAnalysis(id, userId);
    }

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Report not found or you are not authorized to delete it.',
      });
    }

    return res.json({ success: true, message: 'Report deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete report.' });
  }
};

export const getStats = async (req, res) => {
  try {
    if (isDbConnected()) {
      const [totalAnalyses, appearsCredible, potentiallyMisleading, suspicious, inconclusive, totalUsers] =
        await Promise.all([
          NewsAnalysis.countDocuments(),
          NewsAnalysis.countDocuments({ classification: 'Appears Credible' }),
          NewsAnalysis.countDocuments({ classification: 'Potentially Misleading' }),
          NewsAnalysis.countDocuments({ classification: 'Suspicious' }),
          NewsAnalysis.countDocuments({ classification: 'Inconclusive' }),
          User.countDocuments(),
        ]);

      return res.json({
        success: true,
        stats: {
          totalAnalyses,
          totalUsers,
          distribution: {
            appearsCredible,
            potentiallyMisleading,
            suspicious,
            inconclusive,
          },
        },
      });
    } else {
      const stats = memoryStore.getSystemStats();
      return res.json({
        success: true,
        stats: {
          totalAnalyses: stats.totalAnalyses,
          totalUsers: stats.totalUsers,
          distribution: stats.distribution,
        },
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to calculate system statistics.' });
  }
};

export const getLandingSamples = async (req, res) => {
  try {
    let list = [];
    if (isDbConnected()) {
      list = await NewsAnalysis.find().sort({ createdAt: -1 }).limit(6);
    } else {
      list = memoryStore.getAnalyses().slice(0, 6);
    }
    return res.json({ success: true, samples: list });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to load sample analyses.' });
  }
};

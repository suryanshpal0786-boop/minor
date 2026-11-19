import { Router } from 'express';
import {
  analyzeNews,
  getUserAnalyses,
  getAnalysisById,
  deleteAnalysis,
  getStats,
  getLandingSamples,
} from '../controllers/analysisController.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';

const router = Router();

// Public / Landing
router.get('/stats', getStats);
router.get('/samples', getLandingSamples);

// Analysis execution (guests can analyze; if logged in, saved to user library)
router.post('/detect', optionalAuth, analyzeNews);
router.post('/analyze', optionalAuth, analyzeNews);

// User-specific analysis library
router.get('/user/history', requireAuth, getUserAnalyses);
router.get('/:id', getAnalysisById);
router.delete('/:id', requireAuth, deleteAnalysis);

export default router;

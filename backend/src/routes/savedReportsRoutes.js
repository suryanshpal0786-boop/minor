import { Router } from 'express';
import {
  saveReport,
  getUserSavedReports,
  removeSavedReport,
  checkSaved,
} from '../controllers/savedReportsController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.post('/', saveReport);
router.get('/', getUserSavedReports);
router.get('/check/:analysisId', checkSaved);
router.delete('/:analysisId', removeSavedReport);

export default router;

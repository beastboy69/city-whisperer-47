import { Router } from 'express';
import { overview } from '../controllers/analytics.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/overview', requireAuth, requireRole('admin', 'official'), overview);

// Alias: GET /api/analytics
router.get('/', requireAuth, requireRole('admin', 'official'), overview);

export default router;



import { Router } from 'express';
import { body, param } from 'express-validator';
import { submitFeedback } from '../controllers/feedback.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { Feedback } from '../models/Feedback.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.post('/:issueId', requireAuth, [param('issueId').isString(), body('rating').isInt({ min: 1, max: 5 })], validate, submitFeedback);

// Admin: list feedbacks
router.get('/', requireAuth, requireRole('admin'), async (req, res) => {
  const feedbacks = await Feedback.find().sort({ createdAt: -1 });
  res.json(feedbacks);
});

export default router;



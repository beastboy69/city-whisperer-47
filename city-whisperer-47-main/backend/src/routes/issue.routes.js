import { Router } from 'express';
import { body, param } from 'express-validator';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createIssue,
  getAllIssues,
  getUserIssues,
  updateIssueStatus,
  assignIssue,
  deleteIssue
} from '../controllers/issue.controller.js';

const router = Router();

// Spec-compliant endpoint: POST /api/issues
router.post(
  '/',
  requireAuth,
  [body('description').notEmpty(), body('type').notEmpty(), body('location.lat').isNumeric(), body('location.lng').isNumeric()],
  validate,
  createIssue
);

// Backward compatible alias
router.post('/create', requireAuth, [body('description').notEmpty(), body('type').notEmpty(), body('location.lat').isNumeric(), body('location.lng').isNumeric()], validate, createIssue);

router.get('/all', requireAuth, requireRole('admin', 'official'), getAllIssues);

// Spec-compliant: GET /api/issues/user (self)
router.get('/user', requireAuth, getUserIssues);
// Backward compatible
router.get('/user/:id', requireAuth, param('id').isString(), validate, getUserIssues);

// Spec-compliant: PATCH /api/issues/:id/status
router.patch('/:id/status', requireAuth, requireRole('admin', 'official'), param('id').isString(), validate, updateIssueStatus);
// Backward compatible
router.put('/update/:id', requireAuth, requireRole('admin', 'official'), param('id').isString(), validate, updateIssueStatus);
router.put('/assign/:id', requireAuth, requireRole('admin', 'official'), param('id').isString(), validate, assignIssue);
router.delete('/delete/:id', requireAuth, requireRole('admin'), param('id').isString(), validate, deleteIssue);

export default router;



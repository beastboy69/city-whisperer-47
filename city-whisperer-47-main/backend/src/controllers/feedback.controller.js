import { Feedback } from '../models/Feedback.js';
import { Issue } from '../models/Issue.js';

export async function submitFeedback(req, res) {
  const { issueId } = req.params;
  const { rating, comment } = req.body;
  const issue = await Issue.findById(issueId);
  if (!issue) return res.status(404).json({ message: 'Issue not found' });
  const feedback = await Feedback.create({ issueId, rating, comment, userId: req.user._id });
  res.status(201).json(feedback);
}



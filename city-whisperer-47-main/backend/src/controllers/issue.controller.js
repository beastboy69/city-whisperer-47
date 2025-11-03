import { v2 as cloudinary } from 'cloudinary';
import { Issue } from '../models/Issue.js';
import { sendEmail } from '../utils/mailer.js';

function autoAssign(type) {
  const map = {
    Pothole: 'Roads',
    'Broken Streetlight': 'Electrical',
    'Streetlight': 'Electrical',
    'Garbage': 'Sanitation',
    'Garbage Collection': 'Sanitation',
    'Water Leak': 'Water Works'
  };
  return map[type] || 'General Services';
}

export async function createIssue(req, res) {
  try {
    const { title, description, type, location } = req.body;
    let imageURL;
    if (req.body.image && process.env.CLOUDINARY_CLOUD_NAME) {
      const uploaded = await cloudinary.uploader.upload(req.body.image, { folder: 'smartcityfix/issues' });
      imageURL = uploaded.secure_url;
    }
    const assignedDept = autoAssign(type);
    const issue = await Issue.create({
      title,
      description,
      type,
      location,
      imageURL,
      assignedDept,
      createdBy: req.user._id
    });

    const io = req.app.get('io');
    io.to(`user:${req.user._id}`).emit('statusUpdate', { issueId: issue._id, newStatus: issue.status });
    io.to('admins').emit('newIssue', { issueId: issue._id, type: issue.type, createdAt: issue.createdAt });

    await sendEmail({
      to: req.user.email,
      subject: 'Issue submitted successfully',
      html: `<p>Your issue has been submitted and assigned to <b>${assignedDept}</b>.</p>`
    });

    res.status(201).json(issue);
  } catch (e) {
    res.status(500).json({ message: 'Failed to create issue' });
  }
}

export async function getAllIssues(req, res) {
  const issues = await Issue.find().sort({ createdAt: -1 }).populate('createdBy', 'name email');
  res.json(issues);
}

export async function getUserIssues(req, res) {
  const { id } = req.params;
  const issues = await Issue.find({ createdBy: id }).sort({ createdAt: -1 });
  res.json(issues);
}

export async function updateIssueStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;
  const issue = await Issue.findByIdAndUpdate(id, { status }, { new: true }).populate('createdBy', 'email');
  if (!issue) return res.status(404).json({ message: 'Issue not found' });

  const io = req.app.get('io');
  io.to(`issue:${id}`).emit('statusUpdate', { issueId: id, newStatus: status });
  io.to(`user:${issue.createdBy}`).emit('statusUpdate', { issueId: id, newStatus: status });

  if (status === 'Resolved' && issue.createdBy?.email) {
    await sendEmail({
      to: issue.createdBy.email,
      subject: 'Issue resolved',
      html: `<p>Your issue has been resolved. Please provide feedback: <a href="${process.env.CLIENT_ORIGIN}/feedback/${id}">Feedback</a></p>`
    });
  }

  res.json(issue);
}

export async function assignIssue(req, res) {
  const { id } = req.params;
  const { type } = await Issue.findById(id) || {};
  const assignedDept = autoAssign(type);
  const issue = await Issue.findByIdAndUpdate(id, { assignedDept }, { new: true });
  if (!issue) return res.status(404).json({ message: 'Issue not found' });
  res.json(issue);
}

export async function deleteIssue(req, res) {
  const { id } = req.params;
  await Issue.findByIdAndDelete(id);
  res.json({ ok: true });
}



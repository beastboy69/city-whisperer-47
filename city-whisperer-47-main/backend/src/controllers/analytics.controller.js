import { Issue } from '../models/Issue.js';
import { Feedback } from '../models/Feedback.js';
import { User } from '../models/User.js';

export async function overview(req, res) {
  const totalIssues = await Issue.countDocuments();
  const resolvedIssues = await Issue.countDocuments({ status: 'Resolved' });
  const issues = await Issue.find({ status: 'Resolved' }).select('createdAt updatedAt');
  const citizens = await User.countDocuments({ role: 'citizen' });
  const feedbacks = await Feedback.find();

  let totalResolutionMs = 0;
  for (const i of issues) {
    totalResolutionMs += new Date(i.updatedAt).getTime() - new Date(i.createdAt).getTime();
  }
  const avgResolutionTime = issues.length ? totalResolutionMs / issues.length : 0;

  const populationEstimate = 100000; // configurable
  const uniqueCitizens = citizens;
  const adoptionRate = populationEstimate ? (uniqueCitizens / populationEstimate) * 100 : 0;
  const resolutionRate = totalIssues ? (resolvedIssues / totalIssues) * 100 : 0;
  const satisfaction = feedbacks.length ? feedbacks.reduce((a, b) => a + b.rating, 0) / feedbacks.length : 0;

  const validGPSReports = await Issue.countDocuments({ 'location.lat': { $exists: true }, 'location.lng': { $exists: true } });
  const dataAccuracy = totalIssues ? (validGPSReports / totalIssues) * 100 : 0;

  // Top 5 types
  const topTypesAgg = await Issue.aggregate([
    { $group: { _id: '$type', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ]);
  const topTypes = topTypesAgg.map(t => ({ type: t._id, count: t.count }));

  // Average rating per department
  const deptRatings = await Feedback.aggregate([
    { $lookup: { from: 'issues', localField: 'issueId', foreignField: '_id', as: 'issue' } },
    { $unwind: '$issue' },
    { $group: { _id: '$issue.assignedDept', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
    { $project: { _id: 0, department: '$_id', avgRating: 1, count: 1 } }
  ]);

  res.json({
    totals: { totalIssues, resolvedIssues },
    avgResolutionTime,
    adoptionRate,
    resolutionRate,
    satisfaction,
    dataAccuracy,
    topTypes,
    deptRatings
  });
}



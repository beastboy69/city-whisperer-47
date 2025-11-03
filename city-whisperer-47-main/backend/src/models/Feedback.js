import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    issueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Issue', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

export const Feedback = mongoose.model('Feedback', feedbackSchema);



import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String }
  },
  { _id: false }
);

const issueSchema = new mongoose.Schema(
  {
    title: { type: String },
    description: { type: String, required: true },
    type: { type: String, required: true },
    location: { type: locationSchema, required: true },
    imageURL: { type: String },
    status: {
      type: String,
      enum: ['Pending', 'Assigned', 'In Progress', 'Resolved'],
      default: 'Pending'
    },
    assignedDept: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

export const Issue = mongoose.model('Issue', issueSchema);



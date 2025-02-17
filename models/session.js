import mongoose from "mongoose";

// Define the session schema
const sessionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  threshold: {
    type: Number,
    required: true,
  },
  autoReject: {
    type: Boolean,
    default: false,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  projectIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    default: [],
  }],
  coAdmins: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: [],
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'closed'],
    default: 'active',
  },
}, {
  timestamps: true, // Enable timestamps for createdAt and updatedAt
});

// Create and export the model
const Session = mongoose.models.Session || mongoose.model('Session', sessionSchema);

export default Session;

import  mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    abstract: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'], 
      default: 'pending', 
    },
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session', 
      required: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true,
    },
    embedding: {
      type: [Number], 
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);

const Project =  mongoose.models.Project ||  mongoose.model('Project', projectSchema);

export default Project;

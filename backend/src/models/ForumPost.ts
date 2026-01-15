import mongoose, { Document, Schema } from 'mongoose';

export interface IForumPost extends Document {
  content: string;
  author: mongoose.Schema.Types.ObjectId;
  thread: mongoose.Schema.Types.ObjectId;
}

const ForumPostSchema: Schema = new Schema({
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  thread: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ForumThread',
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model<IForumPost>('ForumPost', ForumPostSchema);

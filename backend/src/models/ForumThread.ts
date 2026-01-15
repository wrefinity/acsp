import mongoose, { Document, Schema } from 'mongoose';

export interface IForumThread extends Document {
  title: string;
  content: string;
  author: mongoose.Schema.Types.ObjectId;
  forum: mongoose.Schema.Types.ObjectId;
  posts: mongoose.Schema.Types.ObjectId[];
}

const ForumThreadSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  forum: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Forum',
    required: true
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ForumPost'
  }]
}, {
  timestamps: true
});

export default mongoose.model<IForumThread>('ForumThread', ForumThreadSchema);

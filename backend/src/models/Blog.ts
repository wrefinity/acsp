import mongoose, { Document, Schema } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  image: string;
  content: string;
}

const BlogSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  excerpt: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model<IBlog>('Blog', BlogSchema);
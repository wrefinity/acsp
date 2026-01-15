import mongoose, { Document, Schema } from 'mongoose';

export interface IForum extends Document {
  name: string;
  description: string;
}

const ForumSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

export default mongoose.model<IForum>('Forum', ForumSchema);

import mongoose, { Document, Schema } from 'mongoose';

export interface IExecutive extends Document {
  name: string;
  position: string;
  bio: string;
  imageUrl: string;
  order: number;
  isActive: boolean;
}

const ExecutiveSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  position: {
    type: String,
    required: true,
    trim: true
  },
  bio: {
    type: String,
    required: true,
    trim: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model<IExecutive>('Executive', ExecutiveSchema);
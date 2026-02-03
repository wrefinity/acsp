import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  date: string;
  time: string;
  venue: string;
  type: 'Physical' | 'Virtual' | 'Hybrid';
  description: string;
  imageUrl: string;
  status: 'upcoming' | 'past';
}

const EventSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  venue: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['Physical', 'Virtual', 'Hybrid'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['upcoming', 'past'],
    default: 'upcoming'
  }
}, {
  timestamps: true
});

export default mongoose.model<IEvent>('Event', EventSchema);
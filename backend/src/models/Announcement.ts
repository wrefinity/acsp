import mongoose, { Document, Schema } from 'mongoose';

export interface IAnnouncement extends Document {
  title: string;
  date: string;
  category: string;
  description: string;
  speaker?: string;
  speakerImage?: string;
}

const AnnouncementSchema: Schema = new Schema({
  title: {
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
  description: {
    type: String,
    required: true
  },
  speaker: {
    type: String,
    trim: true
  },
  speakerImage: {
    type: String
  }
}, {
  timestamps: true
});

export default mongoose.model<IAnnouncement>('Announcement', AnnouncementSchema);
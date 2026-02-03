import mongoose, { Document, Schema } from 'mongoose';

export interface IGalleryImage extends Document {
  url: string;
  category: string;
  title: string;
  description?: string;
}

const GalleryImageSchema: Schema = new Schema({
  url: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

export default mongoose.model<IGalleryImage>('GalleryImage', GalleryImageSchema);
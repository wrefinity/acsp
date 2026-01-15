import mongoose, { Document, Schema } from 'mongoose';

export interface ICarouselSlide extends Document {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
  order: number;
}

const CarouselSlideSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  subtitle: {
    type: String,
    required: true,
    trim: true
  },
  ctaText: {
    type: String,
    required: true,
    trim: true
  },
  ctaLink: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true
});

export default mongoose.model<ICarouselSlide>('CarouselSlide', CarouselSlideSchema);
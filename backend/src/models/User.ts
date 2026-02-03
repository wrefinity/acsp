import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'member';
  status: 'pending' | 'unverified_profile' | 'pending_verification' | 'verified' | 'rejected';
  isVerified: boolean;
  verificationToken?: string;
  rejectionReason?: string;
  profile?: {
    photo?: string;
    idCard?: string;
    phone?: string;
    institution?: string;
    specialization?: string;
    bio?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'member'],
    default: 'member'
  },
  status: {
    type: String,
    enum: ['pending', 'unverified_profile', 'pending_verification', 'verified', 'rejected'],
    default: 'pending'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: {
    type: String
  },
  rejectionReason: {
    type: String
  },
  profile: {
    photo: String,
    idCard: String,
    phone: String,
    institution: String,
    specialization: String,
    bio: String
  }
}, {
  timestamps: true
});

export default mongoose.model<IUser>('User', UserSchema);
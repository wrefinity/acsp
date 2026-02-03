import mongoose, { Document } from 'mongoose';
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
declare const _default: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=User.d.ts.map
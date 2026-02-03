import mongoose, { Document } from 'mongoose';
export declare enum UserRole {
    ADMIN = "admin",
    MEMBER = "member",
    MODERATOR = "moderator",
    GUEST = "guest"
}
export declare enum UserStatus {
    PENDING = "pending",
    UNVERIFIED_PROFILE = "unverified_profile",
    PENDING_VERIFICATION = "pending_verification",
    VERIFIED = "verified",
    REJECTED = "rejected",
    SUSPENDED = "suspended",
    DEACTIVATED = "deactivated"
}
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    status: UserStatus;
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
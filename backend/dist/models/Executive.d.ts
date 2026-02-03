import mongoose, { Document } from 'mongoose';
export interface IExecutive extends Document {
    name: string;
    position: string;
    bio: string;
    imageUrl: string;
    order: number;
    isActive: boolean;
}
declare const _default: mongoose.Model<IExecutive, {}, {}, {}, mongoose.Document<unknown, {}, IExecutive, {}, {}> & IExecutive & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Executive.d.ts.map
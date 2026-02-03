import mongoose, { Document } from 'mongoose';
export interface IForum extends Document {
    name: string;
    description: string;
}
declare const _default: mongoose.Model<IForum, {}, {}, {}, mongoose.Document<unknown, {}, IForum, {}, {}> & IForum & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Forum.d.ts.map
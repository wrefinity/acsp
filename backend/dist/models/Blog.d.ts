import mongoose, { Document } from 'mongoose';
export interface IBlog extends Document {
    title: string;
    excerpt: string;
    author: string;
    date: string;
    category: string;
    image: string;
    content: string;
}
declare const _default: mongoose.Model<IBlog, {}, {}, {}, mongoose.Document<unknown, {}, IBlog, {}, {}> & IBlog & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Blog.d.ts.map
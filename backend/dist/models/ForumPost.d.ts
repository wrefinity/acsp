import mongoose, { Document } from 'mongoose';
export interface IForumPost extends Document {
    content: string;
    author: mongoose.Schema.Types.ObjectId;
    thread: mongoose.Schema.Types.ObjectId;
}
declare const _default: mongoose.Model<IForumPost, {}, {}, {}, mongoose.Document<unknown, {}, IForumPost, {}, {}> & IForumPost & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=ForumPost.d.ts.map
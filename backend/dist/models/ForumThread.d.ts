import mongoose, { Document } from 'mongoose';
export interface IForumThread extends Document {
    title: string;
    content: string;
    author: mongoose.Schema.Types.ObjectId;
    forum: mongoose.Schema.Types.ObjectId;
    posts: mongoose.Schema.Types.ObjectId[];
}
declare const _default: mongoose.Model<IForumThread, {}, {}, {}, mongoose.Document<unknown, {}, IForumThread, {}, {}> & IForumThread & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=ForumThread.d.ts.map
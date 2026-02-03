import mongoose, { Document } from 'mongoose';
export interface IAnnouncement extends Document {
    title: string;
    date: string;
    category: string;
    description: string;
    speaker?: string;
    speakerImage?: string;
}
declare const _default: mongoose.Model<IAnnouncement, {}, {}, {}, mongoose.Document<unknown, {}, IAnnouncement, {}, {}> & IAnnouncement & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Announcement.d.ts.map
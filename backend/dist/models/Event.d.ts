import mongoose, { Document } from 'mongoose';
export interface IEvent extends Document {
    title: string;
    date: string;
    time: string;
    venue: string;
    type: 'Physical' | 'Virtual' | 'Hybrid';
    description: string;
    imageUrl: string;
    status: 'upcoming' | 'past';
}
declare const _default: mongoose.Model<IEvent, {}, {}, {}, mongoose.Document<unknown, {}, IEvent, {}, {}> & IEvent & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Event.d.ts.map
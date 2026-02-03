import mongoose, { Document } from 'mongoose';
export interface IGalleryImage extends Document {
    url: string;
    category: string;
    title: string;
    description?: string;
}
declare const _default: mongoose.Model<IGalleryImage, {}, {}, {}, mongoose.Document<unknown, {}, IGalleryImage, {}, {}> & IGalleryImage & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=GalleryImage.d.ts.map
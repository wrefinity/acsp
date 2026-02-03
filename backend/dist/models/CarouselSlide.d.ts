import mongoose, { Document } from 'mongoose';
export interface ICarouselSlide extends Document {
    title: string;
    subtitle: string;
    ctaText: string;
    ctaLink: string;
    imageUrl: string;
    order: number;
}
declare const _default: mongoose.Model<ICarouselSlide, {}, {}, {}, mongoose.Document<unknown, {}, ICarouselSlide, {}, {}> & ICarouselSlide & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=CarouselSlide.d.ts.map
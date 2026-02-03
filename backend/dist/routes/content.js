"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const express_validator_1 = require("express-validator");
const cloudinary_1 = __importDefault(require("cloudinary"));
const multer_1 = __importDefault(require("multer"));
const CarouselSlide_1 = __importDefault(require("../models/CarouselSlide"));
const Announcement_1 = __importDefault(require("../models/Announcement"));
const Event_1 = __importDefault(require("../models/Event"));
const Blog_1 = __importDefault(require("../models/Blog"));
const GalleryImage_1 = __importDefault(require("../models/GalleryImage"));
const Executive_1 = __importDefault(require("../models/Executive"));
const router = express_1.default.Router();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
router.get('/carousel', async (req, res) => {
    try {
        const slides = await CarouselSlide_1.default.find().sort({ order: 1 });
        res.json(slides);
    }
    catch (error) {
        console.error('Get carousel error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
router.post('/carousel', auth_1.authenticateToken, auth_1.requireAdmin, upload.single('image'), [
    (0, express_validator_1.body)('title').notEmpty().withMessage('Title is required'),
    (0, express_validator_1.body)('subtitle').notEmpty().withMessage('Subtitle is required'),
    (0, express_validator_1.body)('ctaText').notEmpty().withMessage('CTA text is required'),
    (0, express_validator_1.body)('ctaLink').isURL().withMessage('Valid URL is required for CTA link'),
    (0, express_validator_1.body)('order').isInt({ min: 0 }).withMessage('Order must be a non-negative integer')
], async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary_1.default.v2.uploader.upload_stream({ folder: 'acsp/carousel' }, (error, result) => {
                if (result) {
                    resolve(result);
                }
                else {
                    reject(error);
                }
            });
            stream.end(req.file.buffer);
        });
        const newSlide = new CarouselSlide_1.default({
            ...req.body,
            imageUrl: result.secure_url
        });
        await newSlide.save();
        res.status(201).json(newSlide);
    }
    catch (error) {
        console.error('Create carousel slide error:', error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
    return res;
});
router.delete('/carousel/:id', auth_1.authenticateToken, auth_1.requireAdmin, async (req, res) => {
    try {
        const deletedSlide = await CarouselSlide_1.default.findByIdAndDelete(req.params.id);
        if (!deletedSlide) {
            return res.status(404).json({ message: 'Slide not found' });
        }
        res.json({ message: 'Slide deleted successfully' });
    }
    catch (error) {
        console.error('Delete carousel slide error:', error);
        res.status(500).json({ message: 'Server error' });
    }
    return res;
});
router.get('/announcements', async (req, res) => {
    try {
        const announcements = await Announcement_1.default.find().sort({ createdAt: -1 });
        res.json(announcements);
    }
    catch (error) {
        console.error('Get announcements error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
router.post('/announcements', auth_1.authenticateToken, auth_1.requireAdmin, [
    (0, express_validator_1.body)('title').notEmpty().withMessage('Title is required'),
    (0, express_validator_1.body)('description').notEmpty().withMessage('Description is required'),
    (0, express_validator_1.body)('category').notEmpty().withMessage('Category is required'),
], async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const newAnnouncement = new Announcement_1.default(req.body);
        await newAnnouncement.save();
        res.status(201).json(newAnnouncement);
    }
    catch (error) {
        console.error('Create announcement error:', error);
        res.status(500).json({ message: 'Server error' });
    }
    return res;
});
router.delete('/announcements/:id', auth_1.authenticateToken, auth_1.requireAdmin, async (req, res) => {
    try {
        const deletedAnnouncement = await Announcement_1.default.findByIdAndDelete(req.params.id);
        if (!deletedAnnouncement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }
        res.json({ message: 'Announcement deleted successfully' });
    }
    catch (error) {
        console.error('Delete announcement error:', error);
        res.status(500).json({ message: 'Server error' });
    }
    return res;
});
router.get('/events', async (req, res) => {
    try {
        const events = await Event_1.default.find().sort({ createdAt: -1 });
        res.json(events);
    }
    catch (error) {
        console.error('Get events error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
router.post('/events', auth_1.authenticateToken, auth_1.requireAdmin, upload.single('image'), [
    (0, express_validator_1.body)('title').notEmpty().withMessage('Title is required'),
    (0, express_validator_1.body)('date').notEmpty().withMessage('Date is required'),
    (0, express_validator_1.body)('time').notEmpty().withMessage('Time is required'),
    (0, express_validator_1.body)('venue').notEmpty().withMessage('Venue is required'),
    (0, express_validator_1.body)('type').isIn(['Physical', 'Virtual', 'Hybrid']).withMessage('Type must be Physical, Virtual, or Hybrid'),
    (0, express_validator_1.body)('description').notEmpty().withMessage('Description is required')
], async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary_1.default.v2.uploader.upload_stream({ folder: 'acsp/events' }, (error, result) => {
                if (result) {
                    resolve(result);
                }
                else {
                    reject(error);
                }
            });
            stream.end(req.file.buffer);
        });
        const newEvent = new Event_1.default({
            ...req.body,
            imageUrl: result.secure_url
        });
        await newEvent.save();
        res.status(201).json(newEvent);
    }
    catch (error) {
        console.error('Create event error:', error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
    return res;
});
router.delete('/events/:id', auth_1.authenticateToken, auth_1.requireAdmin, async (req, res) => {
    try {
        const deletedEvent = await Event_1.default.findByIdAndDelete(req.params.id);
        if (!deletedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json({ message: 'Event deleted successfully' });
    }
    catch (error) {
        console.error('Delete event error:', error);
        res.status(500).json({ message: 'Server error' });
    }
    return res;
});
router.get('/blogs', async (req, res) => {
    try {
        const blogs = await Blog_1.default.find().sort({ createdAt: -1 });
        res.json(blogs);
    }
    catch (error) {
        console.error('Get blogs error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
router.post('/blogs', auth_1.authenticateToken, auth_1.requireAdmin, upload.single('image'), [
    (0, express_validator_1.body)('title').notEmpty().withMessage('Title is required'),
    (0, express_validator_1.body)('excerpt').notEmpty().withMessage('Excerpt is required'),
    (0, express_validator_1.body)('author').notEmpty().withMessage('Author is required'),
    (0, express_validator_1.body)('category').notEmpty().withMessage('Category is required'),
    (0, express_validator_1.body)('content').notEmpty().withMessage('Content is required')
], async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary_1.default.v2.uploader.upload_stream({ folder: 'acsp/blogs' }, (error, result) => {
                if (result) {
                    resolve(result);
                }
                else {
                    reject(error);
                }
            });
            stream.end(req.file.buffer);
        });
        const newBlog = new Blog_1.default({
            ...req.body,
            date: new Date().toISOString().split('T')[0],
            image: result.secure_url
        });
        await newBlog.save();
        res.status(201).json(newBlog);
    }
    catch (error) {
        console.error('Create blog error:', error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
    return res;
});
router.delete('/blogs/:id', auth_1.authenticateToken, auth_1.requireAdmin, async (req, res) => {
    try {
        const deletedBlog = await Blog_1.default.findByIdAndDelete(req.params.id);
        if (!deletedBlog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.json({ message: 'Blog deleted successfully' });
    }
    catch (error) {
        console.error('Delete blog error:', error);
        res.status(500).json({ message: 'Server error' });
    }
    return res;
});
router.get('/gallery', async (req, res) => {
    try {
        const images = await GalleryImage_1.default.find().sort({ createdAt: -1 });
        res.json(images);
    }
    catch (error) {
        console.error('Get gallery error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
router.post('/gallery', auth_1.authenticateToken, auth_1.requireAdmin, upload.single('image'), [
    (0, express_validator_1.body)('title').notEmpty().withMessage('Title is required'),
    (0, express_validator_1.body)('category').notEmpty().withMessage('Category is required')
], async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary_1.default.v2.uploader.upload_stream({ folder: 'acsp/gallery' }, (error, result) => {
                if (result) {
                    resolve(result);
                }
                else {
                    reject(error);
                }
            });
            stream.end(req.file.buffer);
        });
        const newImage = new GalleryImage_1.default({
            ...req.body,
            url: result.secure_url
        });
        await newImage.save();
        res.status(201).json(newImage);
    }
    catch (error) {
        console.error('Create gallery image error:', error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
    return res;
});
router.delete('/gallery/:id', auth_1.authenticateToken, auth_1.requireAdmin, async (req, res) => {
    try {
        const deletedImage = await GalleryImage_1.default.findByIdAndDelete(req.params.id);
        if (!deletedImage) {
            return res.status(404).json({ message: 'Image not found' });
        }
        res.json({ message: 'Image deleted successfully' });
    }
    catch (error) {
        console.error('Delete gallery image error:', error);
        res.status(500).json({ message: 'Server error' });
    }
    return res;
});
router.get('/executives', async (req, res) => {
    try {
        const executives = await Executive_1.default.find().sort({ order: 1, createdAt: -1 });
        res.json(executives);
    }
    catch (error) {
        console.error('Get executives error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
router.post('/executives', auth_1.authenticateToken, auth_1.requireAdmin, upload.single('image'), [
    (0, express_validator_1.body)('name').notEmpty().withMessage('Name is required'),
    (0, express_validator_1.body)('position').notEmpty().withMessage('Position is required'),
    (0, express_validator_1.body)('bio').notEmpty().withMessage('Bio is required'),
    (0, express_validator_1.body)('order').isInt({ min: 0 }).withMessage('Order must be a non-negative integer').optional(),
], async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        let imageUrl = '';
        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary_1.default.v2.uploader.upload_stream({ folder: 'acsp/executives' }, (error, result) => {
                    if (result) {
                        resolve(result);
                    }
                    else {
                        reject(error);
                    }
                });
                stream.end(req.file.buffer);
            });
            imageUrl = result.secure_url;
        }
        else if (req.body.imageUrl) {
            imageUrl = req.body.imageUrl;
        }
        else {
            return res.status(400).json({ message: 'Image is required' });
        }
        const newExecutive = new Executive_1.default({
            name: req.body.name,
            position: req.body.position,
            bio: req.body.bio,
            imageUrl: imageUrl,
            order: parseInt(req.body.order) || 0,
            isActive: req.body.isActive !== undefined ? req.body.isActive : true
        });
        await newExecutive.save();
        res.status(201).json(newExecutive);
    }
    catch (error) {
        console.error('Create executive error:', error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
    return res;
});
router.put('/executives/:id', auth_1.authenticateToken, auth_1.requireAdmin, upload.single('image'), [
    (0, express_validator_1.body)('name').notEmpty().withMessage('Name is required'),
    (0, express_validator_1.body)('position').notEmpty().withMessage('Position is required'),
    (0, express_validator_1.body)('bio').notEmpty().withMessage('Bio is required'),
    (0, express_validator_1.body)('order').isInt({ min: 0 }).withMessage('Order must be a non-negative integer').optional(),
], async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const executive = await Executive_1.default.findById(req.params.id);
        if (!executive) {
            return res.status(404).json({ message: 'Executive not found' });
        }
        executive.name = req.body.name;
        executive.position = req.body.position;
        executive.bio = req.body.bio;
        executive.order = parseInt(req.body.order) || 0;
        executive.isActive = req.body.isActive !== undefined ? req.body.isActive : executive.isActive;
        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary_1.default.v2.uploader.upload_stream({ folder: 'acsp/executives' }, (error, result) => {
                    if (result) {
                        resolve(result);
                    }
                    else {
                        reject(error);
                    }
                });
                stream.end(req.file.buffer);
            });
            executive.imageUrl = result.secure_url;
        }
        await executive.save();
        res.json(executive);
    }
    catch (error) {
        console.error('Update executive error:', error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
    return res;
});
router.delete('/executives/:id', auth_1.authenticateToken, auth_1.requireAdmin, async (req, res) => {
    try {
        const deletedExecutive = await Executive_1.default.findByIdAndDelete(req.params.id);
        if (!deletedExecutive) {
            return res.status(404).json({ message: 'Executive not found' });
        }
        res.json({ message: 'Executive deleted successfully' });
    }
    catch (error) {
        console.error('Delete executive error:', error);
        res.status(500).json({ message: 'Server error' });
    }
    return res;
});
exports.default = router;
//# sourceMappingURL=content.js.map
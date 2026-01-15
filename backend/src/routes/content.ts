import express, { Request, Response } from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { body, validationResult } from 'express-validator';
import cloudinary from 'cloudinary';
import multer from 'multer';

import CarouselSlide from '../models/CarouselSlide';
import Announcement from '../models/Announcement';
import Event from '../models/Event';
import Blog from '../models/Blog';
import GalleryImage from '../models/GalleryImage';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Carousel Routes
router.get('/carousel', async (req: Request, res: Response) => {
    try {
        const slides = await CarouselSlide.find().sort({ order: 1 });
        res.json(slides);
    } catch (error) {
        console.error('Get carousel error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/carousel', authenticateToken, requireAdmin, upload.single('image'), [
    body('title').notEmpty().withMessage('Title is required'),
    body('subtitle').notEmpty().withMessage('Subtitle is required'),
    body('ctaText').notEmpty().withMessage('CTA text is required'),
    body('ctaLink').isURL().withMessage('Valid URL is required for CTA link'),
    body('order').isInt({ min: 0 }).withMessage('Order must be a non-negative integer')
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const result: any = await new Promise((resolve, reject) => {
            const stream = cloudinary.v2.uploader.upload_stream({ folder: 'acsp/carousel' }, (error, result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(error);
                }
            });
            stream.end(req.file.buffer);
        });

        const newSlide = new CarouselSlide({
            ...req.body,
            imageUrl: result.secure_url
        });
        await newSlide.save();
        res.status(201).json(newSlide);
    } catch (error) {
        console.error('Create carousel slide error:', error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
});

router.delete('/carousel/:id', authenticateToken, requireAdmin, async (req: Request, res: Response) => {
    try {
        const deletedSlide = await CarouselSlide.findByIdAndDelete(req.params.id);
        if (!deletedSlide) {
            return res.status(404).json({ message: 'Slide not found' });
        }
        res.json({ message: 'Slide deleted successfully' });
    } catch (error) {
        console.error('Delete carousel slide error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// Announcement Routes
router.get('/announcements', async (req: Request, res: Response) => {
    try {
        const announcements = await Announcement.find().sort({ createdAt: -1 });
        res.json(announcements);
    } catch (error) {
        console.error('Get announcements error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/announcements', authenticateToken, requireAdmin, [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('category').notEmpty().withMessage('Category is required'),
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const newAnnouncement = new Announcement(req.body);
        await newAnnouncement.save();
        res.status(201).json(newAnnouncement);
    } catch (error) {
        console.error('Create announcement error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/announcements/:id', authenticateToken, requireAdmin, async (req: Request, res: Response) => {
    try {
        const deletedAnnouncement = await Announcement.findByIdAndDelete(req.params.id);
        if (!deletedAnnouncement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }
        res.json({ message: 'Announcement deleted successfully' });
    } catch (error) {
        console.error('Delete announcement error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Event Routes
router.get('/events', async (req: Request, res: Response) => {
    try {
        const events = await Event.find().sort({ createdAt: -1 });
        res.json(events);
    } catch (error) {
        console.error('Get events error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/events', authenticateToken, requireAdmin, upload.single('image'), [
    body('title').notEmpty().withMessage('Title is required'),
    body('date').notEmpty().withMessage('Date is required'),
    body('time').notEmpty().withMessage('Time is required'), // Added
    body('venue').notEmpty().withMessage('Venue is required'),
    body('type').isIn(['Physical', 'Virtual', 'Hybrid']).withMessage('Type must be Physical, Virtual, or Hybrid'),
    body('description').notEmpty().withMessage('Description is required') // Added
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const result: any = await new Promise((resolve, reject) => {
            const stream = cloudinary.v2.uploader.upload_stream({ folder: 'acsp/events' }, (error, result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(error);
                }
            });
            stream.end(req.file.buffer);
        });

        const newEvent = new Event({
            ...req.body,
            imageUrl: result.secure_url
        });
        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (error) {
        console.error('Create event error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/events/:id', authenticateToken, requireAdmin, async (req: Request, res: Response) => {
    try {
        const deletedEvent = await Event.findByIdAndDelete(req.params.id);
        if (!deletedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Delete event error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Blog Routes
router.get('/blogs', async (req: Request, res: Response) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.json(blogs);
    } catch (error) {
        console.error('Get blogs error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/blogs', authenticateToken, requireAdmin, upload.single('image'), [
    body('title').notEmpty().withMessage('Title is required'),
    body('excerpt').notEmpty().withMessage('Excerpt is required'),
    body('author').notEmpty().withMessage('Author is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('content').notEmpty().withMessage('Content is required')
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const result: any = await new Promise((resolve, reject) => {
            const stream = cloudinary.v2.uploader.upload_stream({ folder: 'acsp/blogs' }, (error, result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(error);
                }
            });
            stream.end(req.file.buffer);
        });

        const newBlog = new Blog({
            ...req.body,
            date: new Date().toISOString().split('T')[0], // Add current date
            image: result.secure_url
        });
        await newBlog.save();
        res.status(201).json(newBlog);
    } catch (error) {
        console.error('Create blog error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/blogs/:id', authenticateToken, requireAdmin, async (req: Request, res: Response) => {
    try {
        const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
        if (!deletedBlog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.json({ message: 'Blog deleted successfully' });
    } catch (error) {
        console.error('Delete blog error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// Gallery Routes
router.get('/gallery', async (req: Request, res: Response) => {
    try {
        const images = await GalleryImage.find().sort({ createdAt: -1 });
        res.json(images);
    } catch (error) {
        console.error('Get gallery error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/gallery', authenticateToken, requireAdmin, upload.single('image'), [
    body('title').notEmpty().withMessage('Title is required'),
    body('category').notEmpty().withMessage('Category is required')
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const result: any = await new Promise((resolve, reject) => {
            const stream = cloudinary.v2.uploader.upload_stream({ folder: 'acsp/gallery' }, (error, result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(error);
                }
            });
            stream.end(req.file.buffer);
        });

        const newImage = new GalleryImage({
            ...req.body,
            url: result.secure_url
        });
        await newImage.save();
        res.status(201).json(newImage);
    } catch (error) {
        console.error('Create gallery image error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/gallery/:id', authenticateToken, requireAdmin, async (req: Request, res: Response) => {
    try {
        const deletedImage = await GalleryImage.findByIdAndDelete(req.params.id);
        if (!deletedImage) {
            return res.status(404).json({ message: 'Image not found' });
        }
        res.json({ message: 'Image deleted successfully' });
    } catch (error) {
        console.error('Delete gallery image error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;

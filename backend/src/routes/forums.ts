import express, { Request, Response } from 'express';
import { authenticateToken, requireVerifiedMember, requireAdmin } from '../middleware/auth';
import { body, validationResult } from 'express-validator';
import Forum from '../models/Forum';

const router = express.Router();

// Get all forums
router.get('/', authenticateToken, requireVerifiedMember, async (req: Request, res: Response) => {
    try {
        const forums = await Forum.find().sort({ createdAt: -1 });
        res.json(forums);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create a new forum
router.post('/', authenticateToken, requireAdmin, [
    body('name').trim().isLength({ min: 1 }).withMessage('Name is required'),
    body('description').trim().isLength({ min: 1 }).withMessage('Description is required'),
], async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, description } = req.body;

        const newForum = new Forum({
            name,
            description
        });

        await newForum.save();

        res.status(201).json({ message: 'Forum created successfully', forum: newForum });
    } catch (error) {
        console.error('Create forum error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a forum
router.delete('/:id', authenticateToken, requireAdmin, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedForum = await Forum.findByIdAndDelete(id);

        if (!deletedForum) {
            return res.status(404).json({ message: 'Forum not found' });
        }

        res.json({ message: 'Forum deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get threads in a category
router.get('/:forumId/threads', authenticateToken, requireVerifiedMember, async (req: Request, res: Response) => {
    try {
        const { forumId } = req.params;

        // In a real implementation, this would fetch from the database
        const threads = [
            {
                id: 1,
                title: 'Latest Threat Analysis',
                author: 'John Doe',
                createdAt: new Date(),
                replies: 12,
                lastActivity: new Date()
            },
            {
                id: 2,
                title: 'Best Practices for Incident Response',
                author: 'Jane Smith',
                createdAt: new Date(),
                replies: 5,
                lastActivity: new Date()
            }
        ];

        res.json(threads);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get a specific thread
router.get('/threads/:threadId', authenticateToken, requireVerifiedMember, async (req: Request, res: Response) => {
    try {
        const { threadId } = req.params;

        // In a real implementation, this would fetch from the database
        const thread = {
            id: parseInt(threadId),
            title: 'Latest Threat Analysis',
            content: 'This is the content of the thread...',
            author: 'John Doe',
            createdAt: new Date(),
            category: 'Cybersecurity Research',
            posts: [
                {
                    id: 1,
                    content: 'This is the first post in the thread...',
                    author: 'John Doe',
                    createdAt: new Date(),
                    likes: 5
                },
                {
                    id: 2,
                    content: 'This is a reply to the first post...',
                    author: 'Jane Smith',
                    createdAt: new Date(),
                    likes: 2
                }
            ]
        };

        res.json(thread);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

import ForumThread from '../models/ForumThread'; // Added import

// ... existing imports ...

// Create a new thread
router.post('/:forumId/threads', authenticateToken, requireVerifiedMember, [
    body('title').trim().isLength({ min: 5, max: 100 }).withMessage('Title must be between 5 and 100 characters'),
    body('content').trim().isLength({ min: 10 }).withMessage('Content must be at least 10 characters')
], async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { forumId } = req.params; // Extract forumId from URL params
        const { title, content } = req.body;
        // Assuming authenticateToken middleware adds user to req
        const userId = (req as any).user.id;
        const userName = (req as any).user.name; // Assuming user name is also available from auth

        // Create new ForumThread instance
        const newThread = new ForumThread({
            title,
            content,
            author: userId,
            forum: forumId,
            posts: [] // Initialize with empty posts array
        });

        await newThread.save();

        res.status(201).json({ message: 'Thread created successfully', thread: newThread });
    } catch (error) {
        console.error('Create thread error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create a reply to a thread
router.post('/threads/:threadId/reply', authenticateToken, requireVerifiedMember, [
    body('content').trim().isLength({ min: 5 }).withMessage('Reply must be at least 5 characters')
], async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { threadId } = req.params;
        const { content } = req.body;
        const userId = req.body.user.id;

        // In a real implementation, this would save to the database
        const newReply = {
            id: Date.now(), // In real app, this would be MongoDB ObjectId
            threadId: parseInt(threadId),
            content,
            authorId: userId,
            author: req.body.user.name,
            createdAt: new Date()
        };

        res.status(201).json({ message: 'Reply added successfully', reply: newReply });
    } catch (error) {
        console.error('Create reply error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Like a post
router.post('/posts/:postId/like', authenticateToken, requireVerifiedMember, async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;
        const userId = req.body.user.id;

        // In a real implementation, this would update the database
        res.json({ message: 'Post liked successfully', postId, userId });
    } catch (error) {
        console.error('Like post error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get posts for moderation (pending approval) - Admin only
router.get('/posts/pending', authenticateToken, requireAdmin, async (req: Request, res: Response) => {
    try {
        // In a real app, this would fetch posts that need moderation
        // For now, we'll return an empty array as a placeholder
        const pendingPosts = [
            {
                id: 1,
                title: 'Suspicious Activity Report',
                content: 'I noticed some unusual network traffic patterns that might indicate a security breach...',
                author: 'User123',
                category: 'Incident Reports',
                date: new Date(),
                status: 'pending'
            },
            {
                id: 2,
                title: 'New Vulnerability Discovery',
                content: 'I found a potential vulnerability in the authentication system...',
                author: 'SecurityPro',
                category: 'Vulnerability Reports',
                date: new Date(),
                status: 'pending'
            }
        ];

        res.json(pendingPosts);
    } catch (error) {
        console.error('Get pending posts error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Approve a post - Admin only
router.patch('/posts/:postId/approve', authenticateToken, requireAdmin, async (req: Request, res: Response) => {
    try {
        const postId = req.params.postId;

        // In a real app, this would update the post status to approved
        // For now, we'll just return a success message
        res.json({ message: 'Post approved successfully' });
    } catch (error) {
        console.error('Approve post error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Reject a post - Admin only
router.patch('/posts/:postId/reject', authenticateToken, requireAdmin, async (req: Request, res: Response) => {
    try {
        const postId = req.params.postId;
        const { reason } = req.body;

        // In a real app, this would update the post status to rejected
        // For now, we'll just return a success message
        res.json({ message: 'Post rejected successfully', reason });
    } catch (error) {
        console.error('Reject post error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
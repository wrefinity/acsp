"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const express_validator_1 = require("express-validator");
const Forum_1 = __importDefault(require("../models/Forum"));
const router = express_1.default.Router();
router.get('/', auth_1.authenticateToken, auth_1.requireVerifiedMember, async (req, res) => {
    try {
        const forums = await Forum_1.default.find().sort({ createdAt: -1 });
        res.json(forums);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
router.post('/', auth_1.authenticateToken, auth_1.requireAdmin, [
    (0, express_validator_1.body)('name').trim().isLength({ min: 1 }).withMessage('Name is required'),
    (0, express_validator_1.body)('description').trim().isLength({ min: 1 }).withMessage('Description is required'),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { name, description } = req.body;
        const newForum = new Forum_1.default({
            name,
            description
        });
        await newForum.save();
        res.status(201).json({ message: 'Forum created successfully', forum: newForum });
    }
    catch (error) {
        console.error('Create forum error:', error);
        res.status(500).json({ message: 'Server error' });
    }
    return res;
});
router.delete('/:id', auth_1.authenticateToken, auth_1.requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const deletedForum = await Forum_1.default.findByIdAndDelete(id);
        if (!deletedForum) {
            return res.status(404).json({ message: 'Forum not found' });
        }
        res.json({ message: 'Forum deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
    return res;
});
router.get('/:forumId/threads', auth_1.authenticateToken, auth_1.requireVerifiedMember, async (req, res) => {
    try {
        const { forumId } = req.params;
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
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
router.get('/threads/:threadId', auth_1.authenticateToken, auth_1.requireVerifiedMember, async (req, res) => {
    try {
        const { threadId } = req.params;
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
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
const ForumThread_1 = __importDefault(require("../models/ForumThread"));
router.post('/:forumId/threads', auth_1.authenticateToken, auth_1.requireVerifiedMember, [
    (0, express_validator_1.body)('title').trim().isLength({ min: 5, max: 100 }).withMessage('Title must be between 5 and 100 characters'),
    (0, express_validator_1.body)('content').trim().isLength({ min: 10 }).withMessage('Content must be at least 10 characters')
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { forumId } = req.params;
        const { title, content } = req.body;
        const userId = req.user.id;
        const userName = req.user.name;
        const newThread = new ForumThread_1.default({
            title,
            content,
            author: userId,
            forum: forumId,
            posts: []
        });
        await newThread.save();
        res.status(201).json({ message: 'Thread created successfully', thread: newThread });
    }
    catch (error) {
        console.error('Create thread error:', error);
        res.status(500).json({ message: 'Server error' });
    }
    return res;
});
router.post('/threads/:threadId/reply', auth_1.authenticateToken, auth_1.requireVerifiedMember, [
    (0, express_validator_1.body)('content').trim().isLength({ min: 5 }).withMessage('Reply must be at least 5 characters')
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { threadId } = req.params;
        const { content } = req.body;
        const userId = req.body.user.id;
        const newReply = {
            id: Date.now(),
            threadId: parseInt(threadId),
            content,
            authorId: userId,
            author: req.body.user.name,
            createdAt: new Date()
        };
        res.status(201).json({ message: 'Reply added successfully', reply: newReply });
    }
    catch (error) {
        console.error('Create reply error:', error);
        res.status(500).json({ message: 'Server error' });
    }
    return res;
});
router.post('/posts/:postId/like', auth_1.authenticateToken, auth_1.requireVerifiedMember, async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.body.user.id;
        res.json({ message: 'Post liked successfully', postId, userId });
    }
    catch (error) {
        console.error('Like post error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
router.get('/posts/pending', auth_1.authenticateToken, auth_1.requireAdmin, async (req, res) => {
    try {
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
    }
    catch (error) {
        console.error('Get pending posts error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
router.patch('/posts/:postId/approve', auth_1.authenticateToken, auth_1.requireAdmin, async (req, res) => {
    try {
        const postId = req.params.postId;
        res.json({ message: 'Post approved successfully' });
    }
    catch (error) {
        console.error('Approve post error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
router.patch('/posts/:postId/reject', auth_1.authenticateToken, auth_1.requireAdmin, async (req, res) => {
    try {
        const postId = req.params.postId;
        const { reason } = req.body;
        res.json({ message: 'Post rejected successfully', reason });
    }
    catch (error) {
        console.error('Reject post error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.default = router;
//# sourceMappingURL=forums.js.map
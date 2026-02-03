"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importStar(require("../models/User"));
const auth_1 = require("../middleware/auth");
const express_validator_1 = require("express-validator");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const router = express_1.default.Router();
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path_1.default.extname(file.originalname));
    }
});
const upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        }
        else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});
router.get('/profile', auth_1.authenticateToken, async (req, res) => {
    try {
        const user = await User_1.default.findById(req.body.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    }
    catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
    return res;
});
router.put('/profile', auth_1.authenticateToken, [
    (0, express_validator_1.body)('phone').optional().isMobilePhone('any').withMessage('Please enter a valid phone number'),
    (0, express_validator_1.body)('institution').optional().trim().isLength({ min: 2 }).withMessage('Institution must be at least 2 characters'),
    (0, express_validator_1.body)('specialization').optional().trim().isLength({ min: 2 }).withMessage('Specialization must be at least 2 characters'),
    (0, express_validator_1.body)('bio').optional().trim().isLength({ max: 500 }).withMessage('Bio must be less than 500 characters'),
    (0, express_validator_1.body)('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    (0, express_validator_1.body)('email').optional().isEmail().withMessage('Please enter a valid email')
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const userId = req.user.id;
        const { phone, institution, specialization, bio, name, email } = req.body;
        const user = await User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (phone)
            user.profile = { ...user.profile, phone };
        if (institution)
            user.profile = { ...user.profile, institution };
        if (specialization)
            user.profile = { ...user.profile, specialization };
        if (bio)
            user.profile = { ...user.profile, bio };
        if (name)
            user.name = name;
        if (email)
            user.email = email;
        if (user.status === 'unverified_profile' &&
            user.profile?.photo &&
            user.profile?.idCard) {
            user.status = User_1.UserStatus.PENDING_VERIFICATION;
        }
        await user.save();
        res.json({ message: 'Profile updated successfully', user });
    }
    catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
    return res;
});
router.put('/profile/upload', auth_1.authenticateToken, upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'idCard', maxCount: 1 }
]), async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (req.files) {
            const files = req.files;
            if (files['photo']) {
                user.profile = { ...user.profile, photo: `/uploads/${files['photo'][0].filename}` };
            }
            if (files['idCard']) {
                user.profile = { ...user.profile, idCard: `/uploads/${files['idCard'][0].filename}` };
            }
        }
        if (user.status === 'unverified_profile' &&
            user.profile?.photo &&
            user.profile?.idCard) {
            user.status = User_1.UserStatus.PENDING_VERIFICATION;
            ;
        }
        await user.save();
        res.json({ message: 'Profile updated successfully', user });
    }
    catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
    return res;
});
router.get('/', auth_1.authenticateToken, auth_1.requireAdmin, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const users = await User_1.default.find()
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        const total = await User_1.default.countDocuments();
        res.json({
            users,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    }
    catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
router.get('/:id', auth_1.authenticateToken, auth_1.requireAdmin, async (req, res) => {
    try {
        const user = await User_1.default.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    }
    catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
    return res;
});
router.patch('/:id/verify', auth_1.authenticateToken, auth_1.requireAdmin, async (req, res) => {
    try {
        const { action, reason } = req.body;
        const user = await User_1.default.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (action === 'approve') {
            user.status = User_1.UserStatus.VERIFIED;
        }
        else if (action === 'reject') {
            user.status = User_1.UserStatus.REJECTED;
            user.rejectionReason = reason;
        }
        else {
            return res.status(400).json({ message: 'Invalid action. Use "approve" or "reject"' });
        }
        await user.save();
        res.json({ message: `User ${action}ed successfully`, user });
    }
    catch (error) {
        console.error('Verify user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
    return res;
});
router.patch('/:id/role', auth_1.authenticateToken, auth_1.requireAdmin, [
    (0, express_validator_1.body)('role').isIn(['admin', 'member']).withMessage('Invalid role')
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const user = await User_1.default.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.role = req.body.role;
        await user.save();
        res.json({ message: 'User role updated successfully', user });
    }
    catch (error) {
        console.error('Update role error:', error);
        res.status(500).json({ message: 'Server error' });
    }
    return res;
});
router.post('/change-password', auth_1.authenticateToken, [
    (0, express_validator_1.body)('currentPassword').exists().withMessage('Current password is required'),
    (0, express_validator_1.body)('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long')
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;
        const user = await User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isMatch = await bcryptjs_1.default.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, salt);
        user.password = hashedPassword;
        await user.save();
        res.json({ message: 'Password changed successfully' });
    }
    catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ message: 'Server error' });
    }
    return res;
});
exports.default = router;
//# sourceMappingURL=users.js.map
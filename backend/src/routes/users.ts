import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User, { UserStatus } from '../models/User';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { body, validationResult } from 'express-validator';
import multer from 'multer';
import path from 'path';

interface AuthRequest extends Request {
  user?: any;
}

const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.body.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
  return res;
});

// Update user profile (for completing registration)
router.put('/profile', authenticateToken, [
  body('phone').optional().isMobilePhone('any').withMessage('Please enter a valid phone number'),
  body('institution').optional().trim().isLength({ min: 2 }).withMessage('Institution must be at least 2 characters'),
  body('specialization').optional().trim().isLength({ min: 2 }).withMessage('Specialization must be at least 2 characters'),
  body('bio').optional().trim().isLength({ max: 500 }).withMessage('Bio must be less than 500 characters'),
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').optional().isEmail().withMessage('Please enter a valid email')
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = (req as AuthRequest).user.id;
    const { phone, institution, specialization, bio, name, email } = req.body;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update profile fields
    if (phone) user.profile = { ...user.profile, phone };
    if (institution) user.profile = { ...user.profile, institution };
    if (specialization) user.profile = { ...user.profile, specialization };
    if (bio) user.profile = { ...user.profile, bio };
    if (name) user.name = name;
    if (email) user.email = email;

    // Update status to 'pending verification' if profile is complete
    if (user.status === 'unverified_profile' &&
        user.profile?.photo &&
        user.profile?.idCard) {
      user.status = UserStatus.PENDING_VERIFICATION;
    }

    await user.save();

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
  return res;
});

// Update user profile with file uploads
router.put('/profile/upload', authenticateToken, upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'idCard', maxCount: 1 }
]), async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthRequest).user.id;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Handle file uploads
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (files['photo']) {
        user.profile = { ...user.profile, photo: `/uploads/${files['photo'][0].filename}` };
      }
      if (files['idCard']) {
        user.profile = { ...user.profile, idCard: `/uploads/${files['idCard'][0].filename}` };
      }
    }

    // Update status to 'pending verification' if profile is complete
    if (user.status === 'unverified_profile' &&
        user.profile?.photo &&
        user.profile?.idCard) {
      user.status = UserStatus.PENDING_VERIFICATION;;
    }

    await user.save();

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
  return res;
});

// Admin: Get all users
router.get('/', authenticateToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    res.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Get user by ID
router.get('/:id', authenticateToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
  return res;
});

// Admin: Verify or reject user
router.patch('/:id/verify', authenticateToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { action, reason } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (action === 'approve') {
      user.status = UserStatus.VERIFIED;
    } else if (action === 'reject') {
      user.status = UserStatus.REJECTED;
      user.rejectionReason = reason;
    } else {
      return res.status(400).json({ message: 'Invalid action. Use "approve" or "reject"' });
    }

    await user.save();

    res.json({ message: `User ${action}ed successfully`, user });
  } catch (error) {
    console.error('Verify user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
  return res;
});

// Admin: Update user role
router.patch('/:id/role', authenticateToken, requireAdmin, [
  body('role').isIn(['admin', 'member']).withMessage('Invalid role')
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = req.body.role;
    await user.save();

    res.json({ message: 'User role updated successfully', user });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ message: 'Server error' });
  }
  return res;
});

// Change password
router.post('/change-password', authenticateToken, [
  body('currentPassword').exists().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long')
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;
    const userId = (req as AuthRequest).user.id;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
  return res;
});

export default router;
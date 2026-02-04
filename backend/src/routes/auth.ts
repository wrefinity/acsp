import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { UserRole, UserStatus } from '../models/User';
import { body, validationResult } from 'express-validator';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { authenticateToken } from '../middleware/auth';
import { CLIENT_URL, EMAIL_PASS, EMAIL_USER, JWT_SECRET } from '../secrets';

interface AuthRequest extends Request {
  user?: any;
}

const router = express.Router();

// Register a new user
router.post('/register', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: UserRole.MEMBER,
      status: UserStatus.PENDING
    });

    await user.save();

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.verificationToken = verificationToken;
    await user.save();

    // Send verification email
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: EMAIL_USER,
          pass: EMAIL_PASS
        }
      });

      const verificationLink = `${CLIENT_URL || 'http://localhost:5173'}/verify/${verificationToken}`;

      const mailOptions = {
        from: EMAIL_USER || 'noreply@acsp.org',
        to: email,
        subject: 'Verify your email address - ACSP',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0A1A4A;">Welcome to ACSP!</h2>
            <p>Hello ${name},</p>
            <p>Thank you for registering with the Association of Cybersecurity Practitioners (ACSP).</p>
            <p>Please click the button below to verify your email address:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationLink}" style="background-color: #1DB954; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Verify Email</a>
            </div>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all;">${verificationLink}</p>
            <p>This link will expire in 24 hours.</p>
            <p>If you didn't create an account with ACSP, please ignore this email.</p>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
            <p style="font-size: 12px; color: #666;">© 2026 Association of Cybersecurity Practitioners. All rights reserved.</p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      // Still return success even if email fails, but log the error
    }

    return res.status(201).json({
      message: 'User registered successfully. Please check your email for verification.',
      userId: user._id
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error during registration' });
  }
});

// Verify email with token
router.get('/verify/:token', async (req: Request, res: Response) => {
  try {
    const { token: verificationToken } = req.params;

    const user = await User.findOne({ verificationToken: verificationToken });
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    // Update user status to pending verification after email verification
    console.log(`Updating user ${user._id} status from ${user.status} to ${UserStatus.PENDING_VERIFICATION}`);
    user.verificationToken = undefined;
    user.isVerified = true;
    user.status = UserStatus.PENDING_VERIFICATION;
    await user.save();
    console.log(`User ${user._id} status updated to ${user.status}`);

    // Generate JWT token for the newly verified user
    const payload = {
      user: {
        id: user._id,
        role: user.role,
        status: user.status
      }
    };

    const jwtToken = jwt.sign(
      payload,
      JWT_SECRET || 'fallback_secret_key',
      { expiresIn: '1h' }
    );

    console.log(`JWT token generated for user ${user._id}, status: ${user.status}`);

    res.json({
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      },
      message: 'Email verified successfully. Please complete your profile.'
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error during verification' });
  }
  return res;
});

// Login user
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('password').exists().withMessage('Password is required')
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if user is banned
    if (user.status === 'banned') {
      return res.status(400).json({ message: 'Account has been banned. Contact admin for more information.' });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(400).json({ message: 'Please verify your email before logging in' });
    }

    // Generate JWT token
    const payload = {
      user: {
        id: user._id,
        role: user.role,
        status: user.status
      }
    };

    const token = jwt.sign(
      payload,
      JWT_SECRET || 'fallback_secret_key',
      { expiresIn: '1h' }
    );

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error during login' });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    // The authenticateToken middleware will attach the user to req.user
    // Return the user's profile data
    const user = await User.findById(req.user?.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// Forgot password
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email')
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal that the user does not exist
      return res.status(200).json({ message: 'If a user with that email exists, a password reset link has been sent.' });
    }

    // Generate and hash password reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await user.save();

    // Send email
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: EMAIL_USER,
          pass: EMAIL_PASS
        }
      });

      const resetUrl = `${CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

      const mailOptions = {
        from: EMAIL_USER || 'noreply@acsp.org',
        to: user.email,
        subject: 'Password Reset Request - ACSP',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0A1A4A;">Password Reset Request</h2>
            <p>Hello ${user.name},</p>
            <p>You are receiving this email because you (or someone else) have requested the reset of the password for your account.</p>
            <p>Please click the button below to reset your password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background-color: #1DB954; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
            </div>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all;">${resetUrl}</p>
            <p>This link will expire in 10 minutes.</p>
            <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
            <p style="font-size: 12px; color: #666;">© 2026 Association of Cybersecurity Practitioners. All rights reserved.</p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      // Log error but don't fail request
      console.error('Email sending error:', emailError);
    }

    return res.status(200).json({ message: 'If a user with that email exists, a password reset link has been sent.' });

  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// Reset password
router.post('/reset-password/:token', [
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Get hashed token from URL
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Token is invalid or has expired' });
    }

    // Set new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    return res.status(200).json({ message: 'Password has been reset successfully.' });

  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
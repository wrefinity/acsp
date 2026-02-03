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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importStar(require("../models/User"));
const express_validator_1 = require("express-validator");
const crypto_1 = __importDefault(require("crypto"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const auth_1 = require("../middleware/auth");
const secrets_1 = require("@/secrets");
const router = express_1.default.Router();
router.post('/register', [
    (0, express_validator_1.body)('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
    (0, express_validator_1.body)('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
    (0, express_validator_1.body)('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { name, email, password } = req.body;
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        const user = new User_1.default({
            name,
            email,
            password: hashedPassword,
            role: User_1.UserRole.MEMBER,
            status: User_1.UserStatus.PENDING
        });
        await user.save();
        const verificationToken = crypto_1.default.randomBytes(32).toString('hex');
        user.verificationToken = verificationToken;
        await user.save();
        try {
            const transporter = nodemailer_1.default.createTransport({
                service: 'gmail',
                auth: {
                    user: secrets_1.EMAIL_USER,
                    pass: secrets_1.EMAIL_PASS
                }
            });
            const verificationLink = `${secrets_1.CLIENT_URL || 'http://localhost:5173'}/verify/${verificationToken}`;
            const mailOptions = {
                from: secrets_1.EMAIL_USER || 'noreply@acsp.org',
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
        }
        catch (emailError) {
        }
        res.status(201).json({
            message: 'User registered successfully. Please check your email for verification.',
            userId: user._id
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error during registration' });
    }
    return res;
});
router.get('/verify/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const user = await User_1.default.findOne({ verificationToken: token });
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired verification token' });
        }
        user.verificationToken = undefined;
        user.isVerified = true;
        user.status = User_1.UserStatus.UNVERIFIED_PROFILE;
        await user.save();
        res.status(200).json({ message: 'Email verified successfully. Please complete your profile.' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error during verification' });
    }
    return res;
});
router.post('/login', [
    (0, express_validator_1.body)('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
    (0, express_validator_1.body)('password').exists().withMessage('Password is required')
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        if (!user.isVerified) {
            return res.status(400).json({ message: 'Please verify your email before logging in' });
        }
        const payload = {
            user: {
                id: user._id,
                role: user.role,
                status: user.status
            }
        };
        const token = jsonwebtoken_1.default.sign(payload, secrets_1.JWT_SECRET || 'fallback_secret_key', { expiresIn: '1h' });
        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error during login' });
    }
    return res;
});
router.get('/profile', auth_1.authenticateToken, async (req, res) => {
    try {
        const user = await User_1.default.findById(req.user?.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
    return res;
});
exports.default = router;
//# sourceMappingURL=auth.js.map
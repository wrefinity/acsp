"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireVerifiedMember = exports.requireAdmin = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
        const user = await User_1.default.findById(decoded.user.id).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'Token is not valid.' });
        }
        if (user.status === 'banned') {
            return res.status(401).json({ message: 'Account has been banned. Access denied.' });
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ message: 'Token is not valid.' });
    }
    return;
};
exports.authenticateToken = authenticateToken;
const requireAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Access denied. No user authenticated.' });
    }
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
    next();
    return;
};
exports.requireAdmin = requireAdmin;
const requireVerifiedMember = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Access denied. No user authenticated.' });
    }
    if (req.user.status === 'banned') {
        return res.status(403).json({ message: 'Access denied. Account has been banned.' });
    }
    if (req.user.status !== 'verified' && req.user.status !== 'pending_verification') {
        return res.status(403).json({ message: 'Access denied. Account must be verified.' });
    }
    next();
    return;
};
exports.requireVerifiedMember = requireVerifiedMember;
//# sourceMappingURL=auth.js.map
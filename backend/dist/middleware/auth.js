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
exports.requireVerifiedMember = exports.requireAdmin = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importStar(require("../models/User"));
const secrets_1 = require("../secrets");
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }
        const decoded = jsonwebtoken_1.default.verify(token, secrets_1.JWT_SECRET || 'fallback_secret_key');
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
    if (req.user.role !== User_1.UserRole.ADMIN) {
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
    if (req.user.status !== User_1.UserStatus.VERIFIED) {
        return res.status(403).json({ message: 'Access denied. Account must be verified.' });
    }
    next();
    return;
};
exports.requireVerifiedMember = requireVerifiedMember;
//# sourceMappingURL=auth.js.map
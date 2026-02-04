import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, {UserStatus, UserRole} from '../models/User';
import {JWT_SECRET} from "../secrets"
interface AuthRequest extends Request {
  user?: any;
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Get token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // Verify token
    const decoded: any = jwt.verify(token, JWT_SECRET || 'fallback_secret_key');

    // Get user from database
    const user = await User.findById(decoded.user.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Token is not valid.' });
    }

    // Check if user is banned
    if (user.status === 'banned') {
      return res.status(401).json({ message: 'Account has been banned. Access denied.' });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Token is not valid.' });
  }
  return;
};

// Middleware to check if user is admin
export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Access denied. No user authenticated.' });
  }

  if (req.user.role !== UserRole.ADMIN) {
    return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }

  next();
  return;
};

// Middleware to check if user is verified member
export const requireVerifiedMember = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Access denied. No user authenticated.' });
  }

  if (req.user.status !== UserStatus.VERIFIED) {
    return res.status(403).json({ message: 'Access denied. Account must be verified.' });
  }

  next();
  return;
};
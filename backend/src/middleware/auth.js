import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { memoryStore } from '../store/memoryStore.js';
import { isDbConnected } from '../config/db.js';
import { JWT_SECRET } from '../config/jwt.js';

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in to continue.',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    let user = null;
    if (isDbConnected()) {
      user = await User.findById(decoded.id).select('-password');
    } else {
      user = memoryStore.findUserById(decoded.id);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User account not found or session has expired.',
      });
    }

    if (user.status === 'deactivated') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication session.',
    });
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Administrator privileges required.',
    });
  }
  next();
};

export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);

      let user = null;
      if (isDbConnected()) {
        user = await User.findById(decoded.id).select('-password');
      } else {
        user = memoryStore.findUserById(decoded.id);
      }

      if (user && user.status !== 'deactivated') {
        req.user = user;
      }
    }
  } catch {
    // Proceed as guest
  }
  next();
};

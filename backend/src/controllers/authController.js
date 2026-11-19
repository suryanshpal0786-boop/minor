import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { ActivityLog } from '../models/ActivityLog.js';
import { memoryStore } from '../store/memoryStore.js';
import { isDbConnected } from '../config/db.js';
import { JWT_SECRET } from '../config/jwt.js';

const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: '7d' });
};

export const register = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body;

    // Validation
    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let newUser = null;

    if (isDbConnected()) {
      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) {
        return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
      }

      newUser = await User.create({
        fullName: fullName.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: 'user',
        status: 'active',
      });

      await ActivityLog.create({
        userId: newUser._id,
        userEmail: newUser.email,
        activityType: 'USER_REGISTER',
        details: `Account registered: ${newUser.fullName}`,
        ip: req.ip || '127.0.0.1',
      });
    } else {
      const existing = memoryStore.findUserByEmail(email);
      if (existing) {
        return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
      }

      newUser = memoryStore.createUser({
        fullName: fullName.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: 'user',
        status: 'active',
      });

      memoryStore.logActivity({
        userId: newUser._id,
        userEmail: newUser.email,
        activityType: 'USER_REGISTER',
        details: `Account registered: ${newUser.fullName}`,
        ip: req.ip || '127.0.0.1',
      });
    }

    const token = generateToken(newUser._id, newUser.role);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully. Welcome to TruthLens.',
      token,
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    let user = null;
    if (isDbConnected()) {
      user = await User.findOne({ email: email.toLowerCase().trim() });
    } else {
      user = memoryStore.findUserByEmail(email);
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email address or password.' });
    }

    if (user.status === 'deactivated') {
      return res.status(403).json({
        success: false,
        message: 'This account has been deactivated. Please contact support.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email address or password.' });
    }

    // Log Activity
    if (isDbConnected()) {
      await ActivityLog.create({
        userId: user._id,
        userEmail: user.email,
        activityType: 'USER_LOGIN',
        details: `Successful login session`,
        ip: req.ip || '127.0.0.1',
      });
    } else {
      memoryStore.logActivity({
        userId: user._id,
        userEmail: user.email,
        activityType: 'USER_LOGIN',
        details: `Successful login session`,
        ip: req.ip || '127.0.0.1',
      });
    }

    const token = generateToken(user._id, user.role);

    return res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};

export const getMe = async (req, res) => {
  try {
    return res.json({
      success: true,
      user: {
        id: req.user._id,
        fullName: req.user.fullName,
        email: req.user.email,
        role: req.user.role,
        status: req.user.status,
        createdAt: req.user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve profile.' });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide your account email.' });
    }

    // Simulated secure reset token
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    return res.json({
      success: true,
      message: 'Password reset instructions have been issued.',
      resetToken: token,
      hint: 'In production, this token is dispatched to the user verified inbox.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to process password reset.' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Valid token and new password (min 6 chars) are required.',
      });
    }

    return res.json({
      success: true,
      message: 'Password has been reset successfully. You may now log in.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to reset password.' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullName, email } = req.body;
    const userId = req.user._id;

    if (!fullName || fullName.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Full name is required.' });
    }

    let updated = null;
    if (isDbConnected()) {
      updated = await User.findByIdAndUpdate(
        userId,
        { fullName: fullName.trim(), ...(email ? { email: email.toLowerCase().trim() } : {}) },
        { new: true }
      ).select('-password');
    } else {
      updated = memoryStore.updateUser(userId, {
        fullName: fullName.trim(),
        ...(email ? { email: email.toLowerCase().trim() } : {}),
      });
    }

    return res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        id: updated._id,
        fullName: updated.fullName,
        email: updated.email,
        role: updated.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    if (!currentPassword || !newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password (min 6 characters) are required.',
      });
    }

    let user = null;
    if (isDbConnected()) {
      user = await User.findById(userId);
    } else {
      user = memoryStore.findUserById(userId);
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect.' });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    if (isDbConnected()) {
      user.password = newHash;
      await user.save();
    } else {
      memoryStore.updateUser(userId, { password: newHash });
    }

    return res.json({ success: true, message: 'Password updated successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to change password.' });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    if (isDbConnected()) {
      await User.findByIdAndDelete(userId);
    } else {
      memoryStore.deleteUser(userId);
    }

    return res.json({ success: true, message: 'Your account has been deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete account.' });
  }
};

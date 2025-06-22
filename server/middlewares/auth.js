import jwt from 'jsonwebtoken';
import UserModel from '../models/user.model.js';
import dotenv from 'dotenv';
dotenv.config();

export const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.startsWith('Bearer ')
            ? req.headers.authorization.split(' ')[1]
            : req.cookies.token;

        console.log('auth middleware - Token:', token || 'Not provided');
        if (!token) {
            return res.status(401).json({ success: false, error: true, message: 'Access denied: No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('auth middleware - Decoded:', decoded);

        const user = await UserModel.findById(decoded._id).select('_id role email name avatar memberSince').lean();
        if (!user) {
            console.log('auth middleware - User not found for ID:', decoded._id);
            return res.status(401).json({ success: false, error: true, message: 'User not found' });
        }

        req.user = { id: user._id.toString(), role: user.role, email: user.email, name: user.name, avatar: user.avatar, memberSince: user.memberSince };
        console.log('auth middleware - req.user:', req.user);
        next();
    } catch (err) {
        console.error('auth middleware - Error:', err.message, err.stack);
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ success: false, error: true, message: 'Invalid token' });
        }
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, error: true, message: 'Token expired' });
        }
        return res.status(401).json({ success: false, error: true, message: `Authentication failed: ${err.message}` });
    }
};

export const isAdmin = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.user.id);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ success: false, error: true, message: 'Forbidden: Admin access required' });
        }
        next();
    } catch (err) {
        console.error('isAdmin middleware - Error:', err.message, err.stack);
        return res.status(500).json({ success: false, error: true, message: 'Server error' });
    }
};

export const verifyToken = async (req, res, next) => {
    console.log('verifyToken Cookies:', req.cookies); console.log('JWT_SECRET:', process.env.JWT_SECRET || 'undefined');
    const token = req.cookies.sessionToken || req.cookies.access_token || req.cookies.token; console.log('verifyToken: Token received:', token ? 'Yes' : 'No', 'Token:', token);
    if (!token) { return res.status(401).json({ message: 'No token provided', error: true, success: false }); }
    try {
        console.log('Verifying token...');
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        console.log('verifyToken Decoded:', decoded); req.user = { id: decoded._id };
        console.log('verifyToken: User ID:', req.user.id); next();
    }
    catch (err) {
        console.error('verifyToken error:', err.message, err.stack);
        return res.status(401).json({ message: `Invalid token: ${err.message}`, error: true, success: false });
    }
};
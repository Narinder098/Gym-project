import jwt from 'jsonwebtoken';
import UserModel from '../models/user.model.js';
import dotenv from 'dotenv';
dotenv.config();

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.sessionToken || req.cookies.access_token || req.cookies.token || req.headers.authorization?.split(' ')[1];
    console.log('Auth middleware: Token received:', token ? 'Yes' : 'No', 'Token:', token);
    if (!token) {
      return res.status(401).json({ message: 'Access denied: No token provided', error: true, success: false });
    }
    console.log('Auth middleware - Verifying token...');
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    console.log('Auth middleware - Decoded token:', decoded);
    if (!decoded._id) {
      return res.status(401).json({ message: 'Access denied: Invalid token payload', error: true, success: false });
    }
    req.user = { id: decoded._id };
    console.log('Auth middleware - User ID set:', req.user.id);
    next();
  } catch (error) {
    console.error('Auth middleware - Error:', error.message, error.stack);
    return res.status(401).json({ message: `Invalid token: ${error.message}`, error: true, success: false });
  }
};

export const verifyToken = async (req, res, next) => {
  console.log('verifyToken Cookies:', req.cookies);
  console.log('JWT_SECRET:', process.env.JWT_SECRET || 'undefined');
  const token = req.cookies.sessionToken || req.cookies.access_token || req.cookies.token;
  console.log('verifyToken: Token received:', token ? 'Yes' : 'No', 'Token:', token);
  if (!token) {
    return res.status(401).json({ message: 'No token provided', error: true, success: false });
  }
  try {
    console.log('Verifying token...');
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    console.log('verifyToken Decoded:', decoded);
    req.user = { id: decoded._id };
    console.log('verifyToken: User ID:', req.user.id);
    next();
  } catch (err) {
    console.error('verifyToken error:', err.message, err.stack);
    return res.status(401).json({ message: `Invalid token: ${err.message}`, error: true, success: false });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admin access required', error: true, success: false });
    }
    next();
  } catch (err) {
    console.error('isAdmin error:', err.message);
    return res.status(500).json({ message: 'Server error', error: true, success: false });
  }
};

export const protect = async (req, res, next) => {
  try {
    // Get token from cookies or header
    const token =
      req.cookies.sessionToken ||
      req.cookies.access_token ||
      req.cookies.token ||
      req.headers.authorization?.split(" ")[1];

    console.log("Protect middleware: Token received:", token ? "Yes" : "No", "Token:", token);

    if (!token) {
      return res.status(401).json({
        success: false,
        error: true,
        message: "Access denied: No token provided",
      });
    }

    console.log("Protect middleware: Verifying token...");
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    console.log("Protect middleware: Decoded token:", decoded);

    if (!decoded._id) {
      return res.status(401).json({
        success: false,
        error: true,
        message: "Access denied: Invalid token payload",
      });
    }

    // Find user
    const user = await UserModel.findById(decoded._id).select("_id role email name").lean();
    if (!user) {
      return res.status(401).json({
        success: false,
        error: true,
        message: "User not found",
      });
    }

    // Attach user to request
    req.user = { id: user._id, role: user.role, email: user.email, name: user.name };
    console.log("Protect middleware: User set:", req.user);
    next();
  } catch (err) {
    console.error("Protect middleware error:", err.message, err.stack);
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        error: true,
        message: "Invalid token",
      });
    }
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        error: true,
        message: "Token expired",
      });
    }
    res.status(401).json({
      success: false,
      error: true,
      message: `Authentication failed: ${err.message}`,
    });
  }
};

export default auth
import jwt from 'jsonwebtoken';
import UserModel from "../models/user.model.js";
import dotenv from 'dotenv';
dotenv.config();

const auth = async (request, response, next) => {
    try {
        const token = request.cookies.access_token || request?.headers?.authorization?.split(" ")[1];  /// "Bearer", "token"
        //console.log(token);
        if (!token) return response.status(401).json({
            message: 'Access denied',
            error: true,
            success: false
        });

        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decoded);
        if (!decoded) return response.status(401).json({
            message: 'Access denied or expired',
            error: true,
            success: false
        });
        request.userId = decoded.id;
        next();

    }
    catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export const verifyUser = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};

export const isAdmin = async (req, res, next) => {
    const user = await UserModel.findById(req.userId);
    if (user.role !== "admin") return res.status(403).json({ message: "Forbidden" });
    next();
};


export default auth;
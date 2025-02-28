const jwt = require("jsonwebtoken");
const User = require("../models/User");

// 🚀 Middleware to Authenticate User
const authenticate = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id);

        if (!user) {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }

        req.user = user; // Attach user info to request
        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};

// 🚀 Middleware to Allow Only Admin Users
const isAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Forbidden: Admin access required" });
    }
    next();
};

module.exports = { authenticate, isAdmin };

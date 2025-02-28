const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { authenticate, isAdmin } = require("../middleware/auth"); // ✅ Import middleware
const jwt = require("jsonwebtoken"); // ✅ Import JWT
 

const router = express.Router();

// 🚀 Register User
router.post("/register", async (req, res) => {
    try {
        const { name, email, username, password, role } = req.body;

        // ✅ Check if all fields are provided
        if (!name || !email || !username || !password || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // ✅ Check if email or username already exists
        const existingUser = await User.findOne({ where: { email } });
        const existingUsername = await User.findOne({ where: { username } });

        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }
        if (existingUsername) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // ✅ Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ Create new user
        const user = await User.create({ name, email, username, password: hashedPassword, role });

        res.status(201).json({
            message: "User registered successfully",
            userId: user.id
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// 🚀 Login with Username & Password
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log("🔹 Login attempt for username:", username); // Debug log

        const user = await User.findOne({ where: { username } });

        if (!user) {
            console.log("❌ User not found:", username); // Debug log
            return res.status(400).json({ message: "Invalid username or password" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            console.log("❌ Incorrect password for:", username); // Debug log
            return res.status(400).json({ message: "Invalid username or password" });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.json({
            token,
            role: user.role,
            userId: user.id,
            name: user.name,
            email: user.email,
            username: user.username
        });
    } catch (error) {
        console.error("❌ Login error:", error); // Logs exact error in console
        res.status(500).json({ message: "Server error", error });
    }
});

// 🚀 Delete User (Admin Only)
router.delete("/delete/:id", authenticate, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        await user.destroy();
        res.json({ message: "User deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// 🚀 Update User (Admin Only)
router.put("/update/:id", authenticate, isAdmin, async (req, res) => {
    try {
        const { name, email, username, role } = req.body;
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // ✅ Check if email or username is already taken by another user
        const existingUser = await User.findOne({ where: { email } });
        const existingUsername = await User.findOne({ where: { username } });

        if (existingUser && existingUser.id !== user.id) {
            return res.status(400).json({ message: "Email already exists" });
        }
        if (existingUsername && existingUsername.id !== user.id) {
            return res.status(400).json({ message: "Username already exists" });
        }

        await user.update({ name, email, username, role });

        res.json({ message: "User updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});


module.exports = router;

const express = require("express");
const { authenticate } = require("../middleware/auth");
const Customer = require("../models/Customer");

const router = express.Router();

// 🚀 Create Customer
router.post("/create", authenticate, async (req, res) => {
    try {
        const { name, email, phone, address } = req.body;

        // ✅ Check if phone number already exists
        const existingCustomer = await Customer.findOne({ where: { phone } });
        if (existingCustomer) {
            return res.status(400).json({ message: "Phone number already exists" });
        }

        const customer = await Customer.create({ name, email, phone, address });
        res.status(201).json({ message: "Customer added successfully", customer });
    } catch (error) {
        console.error("❌ Error adding customer:", error);
        res.status(500).json({ message: "Server error", error });
    }
});


module.exports = router;

const express = require("express");
const { authenticate, isAdmin } = require("../middleware/auth");
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

// 🚀 Get All Customers
router.get("/", authenticate, async (req, res) => {
    try {
        const customers = await Customer.findAll();
        res.json(customers);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// 🚀 Get Customer by ID
router.get("/:id", authenticate, async (req, res) => {
    try {
        const customer = await Customer.findByPk(req.params.id);

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.json(customer);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// 🚀 Get Customer by Phone Number
router.get("/phone/:phone", authenticate, async (req, res) => {
    try {
        const customer = await Customer.findOne({ where: { phone: req.params.phone } });

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.json(customer);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// 🚀 Update Customer
router.put("/update/:id", authenticate, async (req, res) => {
    try {
        const { name, email, phone, address } = req.body;
        const customer = await Customer.findByPk(req.params.id);

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        // ✅ Ensure phone/email is unique
        const existingCustomer = await Customer.findOne({ where: { phone } });
        if (existingCustomer && existingCustomer.id !== customer.id) {
            return res.status(400).json({ message: "Phone number already in use" });
        }

        await customer.update({ name, email, phone, address });
        res.json({ message: "Customer updated successfully", customer });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// 🚀 Delete Customer
router.delete("/delete/:id", authenticate, isAdmin, async (req, res) => {
    try {
        const customer = await Customer.findByPk(req.params.id);

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        await customer.destroy();
        res.json({ message: "Customer deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});



module.exports = router;

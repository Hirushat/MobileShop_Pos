const express = require("express");
const { authenticate } = require("../middleware/auth");
const { Repair } = require("../models/index");

const router = express.Router();

// 🚀 Add New Repair Record
router.post("/create", authenticate, async (req, res) => {
    try {
        const repair = await Repair.create(req.body);
        res.status(201).json({ message: "Repair added successfully", repair });
    } catch (error) {
        console.error("❌ Error adding repair:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// 🚀 Get Repair by Mobile Number
router.get("/search/:mobile_number", authenticate, async (req, res) => {
    try {
        const repairs = await Repair.findAll({ where: { mobile_number: req.params.mobile_number } });
        if (!repairs.length) return res.status(404).json({ message: "No repairs found for this mobile number" });

        res.json(repairs);
    } catch (error) {
        console.error("❌ Error searching repairs:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// 🚀 Update Repair Status
router.put("/update/:id", authenticate, async (req, res) => {
    try {
        const repair = await Repair.findByPk(req.params.id);
        if (!repair) return res.status(404).json({ message: "Repair not found" });

        await repair.update(req.body);
        res.json({ message: "Repair updated successfully", repair });
    } catch (error) {
        console.error("❌ Error updating repair:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// 🚀 Delete Repair (Admin Only)
router.delete("/delete/:id", authenticate, async (req, res) => {
    try {
        const repair = await Repair.findByPk(req.params.id);
        if (!repair) return res.status(404).json({ message: "Repair not found" });

        await repair.destroy();
        res.json({ message: "Repair deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting repair:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

module.exports = router;

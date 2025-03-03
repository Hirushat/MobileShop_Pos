const express = require("express");
const printReceipt = require("../utils/printReceipt");
const router = express.Router();

// ✅ Print Order Receipt
router.post("/order/:orderId", async (req, res) => {
    try {
        await printReceipt("order", req.params.orderId);
        res.json({ message: "🖨️ Order receipt printing..." });
    } catch (error) {
        console.error("❌ Error printing order receipt:", error);
        res.status(500).json({ message: "❌ Print error", error });
    }
});

// ✅ Print Repair Receipt
router.post("/repair/:repairId", async (req, res) => {
    try {
        await printReceipt("repair", req.params.repairId);
        res.json({ message: "🖨️ Repair receipt printing..." });
    } catch (error) {
        console.error("❌ Error printing repair receipt:", error);
        res.status(500).json({ message: "❌ Print error", error });
    }
});

module.exports = router;

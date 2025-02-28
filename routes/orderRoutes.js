const express = require("express");
const { authenticate } = require("../middleware/auth");
const { Order, OrderItem, Product, Customer } = require("../models/index"); // ✅ Correct Import

const router = express.Router(); // ✅ Define router

// 🚀 Create Order
router.post("/create", authenticate, async (req, res) => {
    try {
        const { customerId, items, paymentMethod } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "No products in the order" });
        }

        // ✅ Check if customerId exists (optional)
        let customer = null;
        if (customerId) {
            customer = await Customer.findByPk(customerId);
            if (!customer) {
                return res.status(404).json({ message: "Customer not found" });
            }
        }

        // ✅ Calculate total amount
        let totalAmount = 0;
        for (let item of items) {
            const product = await Product.findByPk(item.productId);
            if (!product || product.stock < item.quantity) {
                return res.status(400).json({ message: `Product ${product?.name} is out of stock` });
            }
            totalAmount += product.sellingPrice * item.quantity;
        }

        // ✅ Create Order (customerId can be NULL)
        const order = await Order.create({
            userId: req.user.id,
            customerId: customerId || null, // Allows anonymous customers
            totalAmount,
            paymentMethod,
            status: "completed"
        });

        // ✅ Create Order Items & Reduce Stock
        for (let item of items) {
            await OrderItem.create({
                orderId: order.id,
                productId: item.productId,
                quantity: item.quantity,
                price: item.price
            });

            // ✅ Reduce product stock
            await Product.decrement("stock", { by: item.quantity, where: { id: item.productId } });
        }

        res.status(201).json({ message: "Order placed successfully", orderId: order.id });
    } catch (error) {
        console.error("❌ Order creation error:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// 🚀 Get All Orders
router.get("/", authenticate, async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [{ model: Customer, attributes: ["name", "phone"] }]
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

module.exports = router; // ✅ Export router

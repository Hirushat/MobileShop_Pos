const express = require("express");
const { authenticate, isAdmin } = require("../middleware/auth"); // ✅ Import `isAdmin`
const { Order, OrderItem, Product, Customer, User } = require("../models/index"); // ✅ Add User


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

// 🚀 Update Order (Admin Only)
router.put("/update/:id", authenticate, isAdmin, async (req, res) => {
    try {
        const { status, paymentMethod } = req.body;
        const order = await Order.findByPk(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        await order.update({ status, paymentMethod });

        res.json({ message: "Order updated successfully", order });
    } catch (error) {
        console.error("❌ Error updating order:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// 🚀 Delete Order (Admin Only)
router.delete("/delete/:id", authenticate, isAdmin, async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        await OrderItem.destroy({ where: { orderId: order.id } });
        await order.destroy();

        res.json({ message: "Order deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting order:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// 🚀 Get Order by ID (Includes Order Items)
router.get("/:id", authenticate, async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id, {
            include: [
                { model: Customer, attributes: ["name", "phone", "email"] },
                { model: User, attributes: ["username", "role"] },
                { 
                    model: OrderItem,
                    include: [{ model: Product, attributes: ["name", "sellingPrice"] }] 
                }
            ]
        });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.json(order);
    } catch (error) {
        console.error("❌ Error fetching order:", error.message, error.stack); // ✅ Improved Logging
        res.status(500).json({ message: "Server error", error: error.message });
    }
});



module.exports = router; // ✅ Export router

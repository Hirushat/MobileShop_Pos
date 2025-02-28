const express = require("express");
const { authenticate, isAdmin } = require("../middleware/auth");
const Product = require("../models/Product");

const router = express.Router();

// 🚀 Add a Product (Admin Only)
router.post("/add", authenticate, isAdmin, async (req, res) => {
    try {
        const { name, category, cost, sellingPrice, stock, barcode } = req.body;

        if (!name || !category || !cost || !sellingPrice || !stock || !barcode) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const product = await Product.create({ name, category, cost, sellingPrice, stock, barcode });

        res.status(201).json({ message: "Product added successfully", product });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});


// 🚀 Get All Products
router.get("/", authenticate, async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// 🚀 Get Product by ID
router.get("/id/:id", authenticate, async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

//find product by barcode
router.get("/:barcode", authenticate, async (req, res) => {
    try {
        const product = await Product.findOne({ where: { barcode: req.params.barcode } });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(product);
    } catch (error) {
        console.error("❌ Error fetching product by barcode:", error);
        res.status(500).json({ message: "Server error", error });
    }
});


// 🚀 Update Product (Admin Only)
router.put("/update/:id", authenticate, isAdmin, async (req, res) => {
    try {
        const { name, category, cost, sellingPrice, stock, barcode } = req.body;
        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        await product.update({ name, category, cost, sellingPrice, stock, barcode });

        res.json({ message: "Product updated successfully", product });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});


// 🚀 Delete Product (Admin Only)
router.delete("/delete/:id", authenticate, isAdmin, async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        await product.destroy();
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

module.exports = router;


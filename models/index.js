const { sequelize } = require("../config/db");
const User = require("./User");
const Product = require("./Product");
const Customer = require("./Customer");
const Order = require("./Order");
const OrderItem = require("./OrderItem");
const Repair = require("./Repair"); // ✅ Add Repair Model

// Define Relationships
Order.belongsTo(Customer, { foreignKey: "customerId", allowNull: true });
Order.belongsTo(User, { foreignKey: "userId" });
Order.hasMany(OrderItem, { foreignKey: "orderId", onDelete: "CASCADE" });

OrderItem.belongsTo(Order, { foreignKey: "orderId", onDelete: "CASCADE" });
OrderItem.belongsTo(Product, { foreignKey: "productId" });

// Export Models
module.exports = { sequelize, User, Product, Customer, Order, OrderItem, Repair };


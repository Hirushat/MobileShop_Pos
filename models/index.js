const { sequelize } = require("../config/db");
const User = require("./User");
const Product = require("./Product");
const Customer = require("./Customer");
const Order = require("./Order");
const OrderItem = require("./OrderItem");

// Relationships
Order.belongsTo(Customer, { foreignKey: "customerId", allowNull: true });
Order.belongsTo(User, { foreignKey: "userId" });
Order.hasMany(OrderItem, { foreignKey: "orderId" });

OrderItem.belongsTo(Product, { foreignKey: "productId" });

module.exports = { sequelize, User, Product, Customer, Order, OrderItem };

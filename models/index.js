const { sequelize } = require("../config/db");
const User = require("./User");
const Product = require("./Product");
const Customer = require("./Customer");
const Order = require("./Order");
const OrderItem = require("./OrderItem");

// ✅ Define Relationships
Order.belongsTo(Customer, { foreignKey: "customerId", allowNull: true });
Order.belongsTo(User, { foreignKey: "userId" });
Order.hasMany(OrderItem, { foreignKey: "orderId", onDelete: "CASCADE" }); // ✅ Ensures order deletion removes items

OrderItem.belongsTo(Order, { foreignKey: "orderId", onDelete: "CASCADE" }); // ✅ Establish OrderItem → Order link
OrderItem.belongsTo(Product, { foreignKey: "productId" }); // ✅ Establish OrderItem → Product link

module.exports = { sequelize, User, Product, Customer, Order, OrderItem };

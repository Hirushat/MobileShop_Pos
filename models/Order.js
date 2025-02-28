const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db"); // ✅ Import sequelize
const Customer = require("./Customer");

const Order = sequelize.define("Order", { // ✅ Fix ReferenceError
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false }, // Cashier/Admin ID
    customerId: { type: DataTypes.INTEGER, allowNull: true }, // ✅ Make customerId optional
    totalAmount: { type: DataTypes.FLOAT, allowNull: false },
    paymentMethod: { type: DataTypes.ENUM("cash", "card", "online"), allowNull: false },
    status: { type: DataTypes.ENUM("pending", "completed", "cancelled"), defaultValue: "pending" }
});

// ✅ Relationship: Orders belong to Customers (nullable)
Order.belongsTo(Customer, { foreignKey: "customerId", allowNull: true });

module.exports = Order;

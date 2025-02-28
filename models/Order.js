const Customer = require("./Customer");

const Order = sequelize.define("Order", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false }, // Cashier/Admin ID
    customerId: { type: DataTypes.INTEGER, allowNull: true }, // Customer who made the order
    totalAmount: { type: DataTypes.FLOAT, allowNull: false },
    paymentMethod: { type: DataTypes.ENUM("cash", "card", "online"), allowNull: false },
    status: { type: DataTypes.ENUM("pending", "completed", "cancelled"), defaultValue: "pending" }
});

// ✅ Relationship: Some orders might not have a customer
Order.belongsTo(Customer, { foreignKey: "customerId", allowNull: true });


module.exports = Order;

const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const OrderItem = sequelize.define("OrderItem", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    orderId: { type: DataTypes.INTEGER, allowNull: false },
    productId: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false } // Price at time of purchase
});

module.exports = OrderItem;

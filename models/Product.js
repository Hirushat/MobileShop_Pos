const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Product = sequelize.define("Product", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    cost: { type: DataTypes.FLOAT, allowNull: false },  // New field
    sellingPrice: { type: DataTypes.FLOAT, allowNull: false }, // New field
    stock: { type: DataTypes.INTEGER, allowNull: false },
    barcode: { type: DataTypes.STRING, unique: true },
});

module.exports = Product;

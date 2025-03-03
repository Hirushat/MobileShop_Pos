const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const moment = require("moment-timezone"); // ✅ Install if not already installed

const Repair = sequelize.define("Repair", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    mobile_number: { type: DataTypes.STRING, allowNull: false },
    customer_name: { type: DataTypes.STRING, allowNull: false },
    issue_description: { type: DataTypes.TEXT, allowNull: false },
    repair_status: { 
        type: DataTypes.ENUM("Pending", "In Progress", "Completed", "Delivered"),
        defaultValue: "Pending"
    },
    repair_date: { 
        type: DataTypes.DATE, 
        defaultValue: () => moment().tz("Asia/Colombo").format("YYYY-MM-DD HH:mm:ss") // ✅ Converts to Sri Lankan time
    },
    estimated_completion_date: { type: DataTypes.DATE },
    repair_cost: { type: DataTypes.DECIMAL(10, 2) },
    technician_name: { type: DataTypes.STRING },
    notes: { type: DataTypes.TEXT }
}, { timestamps: false }); // ✅ Disable timestamps

module.exports = Repair;

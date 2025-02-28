const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { connectDB, sequelize } = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/products", require("./routes/productRoutes"));

// Sync Database
sequelize.sync().then(() => console.log("✅ Database Synced"));

app.listen(5000, () => console.log("🚀 Server running on port 5000"));

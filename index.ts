import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./src/routes/authRoutes.ts";
import categoryRoutes from "./src/routes/categoryRoutes.ts";
import transactionRoutes from "./src/routes/transactionRoutes.ts";
import budgetRoutes from "./src/routes/budgetRoutes.ts";

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/budgets", budgetRoutes); // Add this line

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Nuna API" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;

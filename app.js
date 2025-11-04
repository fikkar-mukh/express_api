import express from "express";
import { PORT } from "./config/env.js";
import bodyParser from "body-parser";
import membershipRoutes from "./modules/membership/membership.routes.js"
import db from "./config/db.js";
import informationRoutes from "./modules/information/information.routes.js";
import transactionRoutes from "./modules/transaction/transaction.routes.js";

const app = express();
app.use(bodyParser.json());

// global req.db
app.use((req, res, next) => {
  console.log('=========>',db);
  req.db = db;
  next();
});

// === ROUTES MEMBERSHIP ===
app.use("/uploads", express.static("uploads"));
app.use("/api/membership", membershipRoutes);

// === ROUTES INFORMATION ===
app.use("/api/information", informationRoutes);

// === ROUTES TRANSACTION ===
app.use("/api/transaction", transactionRoutes);

console.log("Loaded JWT_SECRET:", process.env.JWT_SECRET);
// === DEFAULT ERROR HANDLER ===
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 500,
    message: "Internal Server Error",
    data: null,
  });
});

// === RUN SERVER ===
console.log("Server running with PORT:", PORT);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
/**
 * Express Application & API Server
 * Smart College Department Budget Management System
 * Analytics & Reporting Subsystem (Member 4)
 */

import express from "express";
import cors from "cors";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Mount Subsystems
app.use("/api/analytics", analyticsRoutes);
app.use("/api/reports", reportRoutes);

// Healthcheck & Metadata
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "Smart College Financial Intelligence & Analytics API",
    version: "1.0.0",
    college: "Mysuru Institute of Technology"
  });
});

export default app;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`[Financial Intelligence API] Server listening on port ${PORT}`);
  });
}

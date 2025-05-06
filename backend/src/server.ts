import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import jobRoutes from "./routes/jobs";
import mongoose from "mongoose";

// Load environment variables
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Environment variables
const NODE_ENV = process.env.NODE_ENV || "development";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// Middleware
app.use(express.json());

// CORS configuration - Allow all origins for now to troubleshoot
app.use(
  cors({
    origin: "*", // Allow all origins
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept", "x-nextjs-data"],
    credentials: true,
  })
);

// Root endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    message: "JobHub API is running",
    endpoints: {
      jobs: "/api/jobs",
    },
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    environment: NODE_ENV,
    mongodb:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// Routes
app.use("/api/jobs", jobRoutes);

// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({
      success: false,
      error: "Something went wrong!",
      message: err.message,
    });
  }
);

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);
      console.log(
        `MongoDB connection status: ${
          mongoose.connection.readyState === 1 ? "connected" : "disconnected"
        }`
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

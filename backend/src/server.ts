import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import jobRoutes from "./routes/jobs";
import mongoose from "mongoose";

// Load environment variables from .env
dotenv.config();

const app: Express = express();
const PORT = parseInt(process.env.PORT || "5000", 10);

const NODE_ENV = process.env.NODE_ENV || "development";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// Setup middleware
app.use(express.json());

// Configure CORS (currently open to all origins for testing)
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "x-nextjs-data",
    ],
    credentials: true,
  })
);

// Root endpoint for a basic API status message
app.get("/", (req, res) => {
  res.status(200).json({
    message: "JobHub API is running",
    endpoints: {
      jobs: "/api/jobs",
    },
  });
});

// Health check endpoint to monitor app and DB status
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    environment: NODE_ENV,
    mongodb:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// Job routes
app.use("/api/jobs", jobRoutes);

// Global error handler
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

// Start the server
const startServer = async () => {
  try {
    await connectDB();

    // For platforms like Render, bind to 0.0.0.0
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`✅ Server running in ${NODE_ENV} mode on port ${PORT}`);
      console.log(
        `✅ MongoDB connection status: ${
          mongoose.connection.readyState === 1 ? "connected" : "disconnected"
        }`
      );
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

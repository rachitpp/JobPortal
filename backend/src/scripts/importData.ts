import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Job from "../models/Job";

// Load environment variables (like MongoDB URI)
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "";

// Main function to import job data into the database
const importData = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected");

    // Build the path to the JSON file
    const jsonPath = path.join(__dirname, "../data/Jobs.json");

    // Check if the file exists
    if (!fs.existsSync(jsonPath)) {
      console.error("Jobs.json file not found at:", jsonPath);
      process.exit(1);
    }

    // Read and parse the job data
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

    // Clear any existing jobs before importing fresh data
    await Job.deleteMany({});
    console.log("Old jobs cleared");

    // Insert the new job entries
    const formattedData = Array.isArray(jsonData) ? jsonData : [];
    await Job.insertMany(formattedData);

    console.log(`${formattedData.length} jobs imported successfully`);
    process.exit(0);
  } catch (error) {
    console.error("Import failed:", error);
    process.exit(1);
  }
};

importData();

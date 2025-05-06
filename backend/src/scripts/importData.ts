import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Job from "../models/Job";

// Load environment variables
dotenv.config();

// MongoDB Connection String
const MONGO_URI = process.env.MONGO_URI || "";

// Read JSON file
const importData = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected");

    // Path to the JSON file in the backend/src/data directory
    const jsonPath = path.join(__dirname, "../data/Jobs.json");

    console.log("Looking for Jobs.json at:", jsonPath);

    // Check if file exists
    if (!fs.existsSync(jsonPath)) {
      console.error("Jobs.json file not found at:", jsonPath);
      process.exit(1);
    }

    // Read and parse the JSON file
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
    console.log("JSON data loaded successfully");

    // Delete existing data
    await Job.deleteMany({});
    console.log("Existing jobs deleted");

    // Use the data as is, without transformation
    const formattedData = Array.isArray(jsonData) ? jsonData : [];
    console.log(`Processing ${formattedData.length} jobs`);

    // Insert data
    await Job.insertMany(formattedData);
    console.log(`${formattedData.length} jobs imported successfully`);

    // Exit process
    process.exit(0);
  } catch (error) {
    console.error("Error importing data:", error);
    process.exit(1);
  }
};

importData();

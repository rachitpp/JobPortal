import { Request, Response } from "express";
import Job, { IJob } from "../models/Job";

// Get all jobs or filter by location with pagination
export const getJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { location, page = 1, limit = 20 } = req.query;
    let query = {};

    // Filter by location if provided
    if (location) {
      query = { location: { $regex: location.toString(), $options: "i" } };
    }

    // Check if all jobs are requested (limit=0 or limit=all)
    const getAllJobs = limit.toString() === "0" || limit.toString() === "all";

    // Get total count first (for pagination metadata)
    const total = await Job.countDocuments(query);

    // If all jobs are requested, skip pagination
    if (getAllJobs) {
      const allJobs = await Job.find(query).sort({ postedDate: -1 });

      res.status(200).json({
        success: true,
        count: allJobs.length,
        total,
        data: allJobs,
      });
      return;
    }

    // Calculate pagination for normal requests
    const pageNum = parseInt(page.toString(), 10);
    const limitNum = parseInt(limit.toString(), 10);
    const skip = (pageNum - 1) * limitNum;

    // Get paginated jobs
    const jobs = await Job.find(query)
      .sort({ postedDate: -1 }) // Sort by posted date (newest first)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: jobs.length,
      total,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        pageSize: limitNum,
        totalItems: total,
      },
      data: jobs,
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

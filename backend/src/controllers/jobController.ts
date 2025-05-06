import { Request, Response } from "express";
import Job, { IJob } from "../models/Job";

// Controller to get all jobs, with optional location filtering and pagination support
export const getJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { location, page = 1, limit = 20 } = req.query;
    let query = {};

    // If a location is passed in the query, add a case-insensitive filter for it
    if (location) {
      query = { location: { $regex: location.toString(), $options: "i" } };
    }

    // Check if the request is asking for all jobs (limit = 0 or 'all')
    const getAllJobs = limit.toString() === "0" || limit.toString() === "all";

    // Get the total number of jobs matching the filter (useful for pagination info)
    const total = await Job.countDocuments(query);

    // If all jobs are requested, skip pagination logic
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

    // For normal paginated requests, figure out how many to skip and how many to return
    const pageNum = parseInt(page.toString(), 10);
    const limitNum = parseInt(limit.toString(), 10);
    const skip = (pageNum - 1) * limitNum;

    // Fetch the jobs for the current page, sorted so the most recent ones come first
    const jobs = await Job.find(query)
      .sort({ postedDate: -1 })
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

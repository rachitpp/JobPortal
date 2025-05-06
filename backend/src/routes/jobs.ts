import express, { Router } from "express";
import { getJobs } from "../controllers/jobController";

const router: Router = express.Router();

// GET /api/jobs - Get all jobs or filter by location
router.get("/", getJobs);

export default router;

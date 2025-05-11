import { JobsResponse } from "../types/jobs";

// Define the API base URL, using env variable or fallback to production
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://jobportal-m0lg.onrender.com";

// Generic fetch helper with timeout and error handling
const fetchWithTimeout = async (
  url: string,
  options: RequestInit = {},
  timeout = 30000 // Increased timeout from 15s to 30s to accommodate cold starts
) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort("Request timeout"),
    timeout
  );

  try {
    console.log("Making request to:", url);
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      mode: "cors",
      cache: "no-store", // Disable caching to ensure fresh data
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`);
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return response;
  } catch (error) {
    clearTimeout(timeoutId);

    // Check if the error is due to an aborted request
    if (error instanceof DOMException && error.name === "AbortError") {
      console.log("Request was aborted", url);
      throw new Error("Request was cancelled");
    }

    console.error("Fetch error:", error);
    throw error;
  }
};

interface FetchJobsParams {
  page?: number;
  limit?: number | string;
  location?: string;
}

// Core function to fetch jobs, supports pagination and location filtering
export const fetchJobs = async (
  params: FetchJobsParams = {}
): Promise<JobsResponse> => {
  try {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.location) queryParams.append("location", params.location);

    const url = `${API_BASE_URL}/api/jobs${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    console.log("Fetching jobs from:", url);

    const response = await fetchWithTimeout(url);
    const data = await response.json();

    console.log("Jobs data received:", {
      count: data.count,
      total: data.total,
      success: data.success,
    });

    return data;
  } catch (error) {
    if (error instanceof Error && error.message === "Request was cancelled") {
      // Return empty result for cancelled requests
      console.log("Returning empty result for cancelled request");
      return {
        success: true,
        count: 0,
        total: 0,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          pageSize: 20,
          totalItems: 0,
        },
        data: [],
      };
    }

    console.error("Error fetching jobs:", error);
    throw error;
  }
};

// Helper for default paginated fetch (used as fallback)
export const fetchAllJobs = async (): Promise<JobsResponse> => {
  return fetchJobs({ limit: 20, page: 1 });
};

// Helper to fetch jobs filtered by location (default page + limit)
export const fetchJobsByLocation = async (
  location: string
): Promise<JobsResponse> => {
  return fetchJobs({ location, limit: 20, page: 1 });
};

// Fetch all jobs without any pagination limit (use carefully for large datasets)
export const fetchAllJobsNoLimit = async (
  location?: string
): Promise<JobsResponse> => {
  return fetchJobs({ location, limit: "all" });
};

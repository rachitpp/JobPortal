import { JobsResponse } from "../types/jobs";

// API base URL - use environment variable or fallback to the deployed backend URL
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://jobhub-7scy.onrender.com";

// Simple fetch function with better error handling
const fetchWithTimeout = async (
  url: string,
  options: RequestInit = {},
  timeout = 10000
) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    console.log("Making request to:", url);
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      mode: "cors",
      credentials: "omit",
    });
    clearTimeout(id);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Response not OK:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    console.log("Response status:", response.status);
    return response;
  } catch (error) {
    clearTimeout(id);
    console.error("Fetch error:", error);
    throw error;
  }
};

interface FetchJobsParams {
  page?: number;
  limit?: number | string;
  location?: string;
}

export const fetchJobs = async (
  params: FetchJobsParams = {}
): Promise<JobsResponse> => {
  try {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.location) queryParams.append("location", params.location);

    // Use absolute URL with the API base URL
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
    console.error("Error fetching jobs:", error);
    throw error;
  }
};

// Kept for backward compatibility
export const fetchAllJobs = async (): Promise<JobsResponse> => {
  return fetchJobs({ limit: 20, page: 1 });
};

// Kept for backward compatibility
export const fetchJobsByLocation = async (
  location: string
): Promise<JobsResponse> => {
  return fetchJobs({ location, limit: 20, page: 1 });
};

// Fetch all jobs (10,000) at once without pagination
export const fetchAllJobsNoLimit = async (
  location?: string
): Promise<JobsResponse> => {
  return fetchJobs({ location, limit: "all" });
};

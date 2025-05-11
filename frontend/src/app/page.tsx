"use client";

import { useState, useEffect, useRef } from "react";
import { fetchJobs } from "../api/JobsApi";
import { Job } from "../types/jobs";
import JobCard from "../components/JobCard";
import SearchBar from "../components/SearchBar";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import JobModal from "../components/JobModal";

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchLocation, setSearchLocation] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const activeRequestRef = useRef(false);

  const loadJobs = async (page: number = 1, location: string = "") => {
    // If there's already an active request, skip this one
    if (activeRequestRef.current) {
      console.log("Skipping request because there's already an active one");
      return Promise.resolve(); // Return resolved promise when skipping
    }

    try {
      activeRequestRef.current = true;
      setLoading(true);
      setError(null);
      console.log("Loading jobs:", { page, location });

      const response = await fetchJobs({
        page,
        limit: 20,
        location,
      });

      console.log("Jobs response:", response);
      setJobs(response.data);
      setTotalPages(Math.ceil(response.total / 20) || 1);
      setTotalJobs(response.total || 0);
      return Promise.resolve(response); // Return successful response
    } catch (err) {
      console.error("Error loading jobs:", err);
      // Don't show error message for aborted requests
      if (err instanceof Error && err.message !== "Request was cancelled") {
        setError(err instanceof Error ? err.message : "Failed to load jobs");
      }
      return Promise.reject(err); // Return rejected promise for retry mechanism
    } finally {
      setLoading(false);
      activeRequestRef.current = false;
    }
  };

  // Use a more controlled approach for API calls
  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 3;

    const attemptLoad = () => {
      const timer = setTimeout(() => {
        loadJobs(currentPage, searchLocation).catch((error) => {
          console.error("Failed to load jobs:", error);
          if (retryCount < maxRetries) {
            retryCount++;
            console.log(`Retrying job fetch (${retryCount}/${maxRetries})...`);
            attemptLoad(); // Retry with increasing delay
          }
        });
      }, 100 * Math.pow(2, retryCount)); // Exponential backoff

      return timer;
    };

    const timer = attemptLoad();
    return () => clearTimeout(timer);
  }, [currentPage, searchLocation]);

  const handleSearch = (location: string) => {
    // Only update if different to prevent unnecessary rerenders
    if (location !== searchLocation) {
      setSearchLocation(location);
      setCurrentPage(1);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage !== currentPage) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={() => loadJobs(currentPage, searchLocation)}
      />
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header with responsive improvements */}
      <header className="bg-white border-b border-gray-100 relative z-30">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between py-2.5 px-3 sm:px-5 lg:px-6">
            <div className="flex items-center space-x-1.5">
              <div className="h-5 w-1 bg-blue-500 rounded-full"></div>
              <h1 className="text-base text-gray-900 font-semibold">JOBS</h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="text-gray-800 font-medium text-sm">
                Dashboard
              </a>
              <a href="#" className="text-blue-600 font-medium text-sm">
                Search
              </a>
              <a href="#" className="text-gray-800 font-medium text-sm">
                Categories
              </a>
              <a href="#" className="text-gray-800 font-medium text-sm">
                Companies
              </a>
            </nav>
            <div className="text-xs text-gray-700 font-medium">
              {totalJobs.toLocaleString()} opportunities
            </div>
          </div>
        </div>
      </header>

      {/* Search section with responsive improvements */}
      <div className="bg-gray-50 py-5 sm:py-8 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-3 sm:px-5 lg:px-6 text-center">
          <h2 className="text-lg sm:text-2xl font-medium text-gray-900 mb-1.5 sm:mb-2">
            Find your perfect job
          </h2>
          <p className="text-gray-700 mb-3 sm:mb-5 max-w-2xl mx-auto text-xs sm:text-sm font-medium">
            We have {totalJobs.toLocaleString()} opportunities waiting for you
          </p>

          <div className="bg-white shadow-sm rounded-md p-1.5 mx-auto max-w-full sm:max-w-xl">
            <SearchBar
              onSearch={handleSearch}
              initialValue={searchLocation}
              debounceTime={500}
            />
          </div>

          <div className="flex flex-wrap justify-center mt-3 sm:mt-4 gap-2 sm:gap-4">
            <button className="inline-flex items-center text-gray-700 text-xs font-medium py-1 px-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors">
              <span className="h-2.5 w-2.5 rounded-sm bg-green-500 mr-1.5"></span>
              Remote opportunities
            </button>
            <button className="inline-flex items-center text-gray-700 text-xs font-medium py-1 px-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors">
              <span className="h-2.5 w-2.5 rounded-sm bg-blue-500 mr-1.5"></span>
              Full-time roles
            </button>
            <button className="inline-flex items-center text-gray-700 text-xs font-medium py-1 px-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors">
              <span className="h-2.5 w-2.5 rounded-sm bg-purple-500 mr-1.5"></span>
              Freelance work
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 py-3 sm:py-4">
        {/* Stats and Results in a responsive grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-4 mb-3 sm:mb-4">
          {/* Stats section - responsive */}
          <div className="bg-white rounded-md border border-gray-200 p-2 sm:p-2.5 flex flex-wrap justify-between items-center">
            {loading ? (
              <div className="w-full flex justify-center py-1">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="stroke-current text-blue-500"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    fill="none"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="opacity-25"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    fill="none"
                    strokeWidth="2"
                    strokeDasharray="60"
                    strokeDashoffset="30"
                    strokeLinecap="round"
                    className="opacity-75 animate-[dash_1.5s_ease-in-out_infinite]"
                  />
                </svg>
              </div>
            ) : (
              <>
                <div className="flex items-center w-1/3 px-2">
                  <div className="text-blue-500 mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Recently Added</p>
                    <p className="text-sm font-semibold text-gray-800">437</p>
                  </div>
                </div>

                <div className="flex items-center w-1/3 px-2">
                  <div className="text-green-500 mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Remote Jobs</p>
                    <p className="text-sm font-semibold text-gray-800">1,209</p>
                  </div>
                </div>

                <div className="flex items-center w-1/3 px-2">
                  <div className="text-purple-500 mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Full-Time</p>
                    <p className="text-sm font-semibold text-gray-800">3,542</p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Results counter and pagination - responsive */}
          <div className="bg-white rounded-md shadow-sm border border-gray-100 p-2 flex justify-between items-center">
            {loading ? (
              <div className="w-full flex justify-center py-1">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="stroke-current text-purple-500"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    fill="none"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="opacity-25"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    fill="none"
                    strokeWidth="2"
                    strokeDasharray="60"
                    strokeDashoffset="30"
                    strokeLinecap="round"
                    className="opacity-75 animate-[dash_1.5s_ease-in-out_infinite]"
                  />
                </svg>
              </div>
            ) : (
              <>
                <div className="flex items-center">
                  <div className="flex items-center">
                    <div className="bg-purple-600 text-white rounded-full w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center font-bold text-xs sm:text-sm mr-2 sm:mr-3">
                      {jobs.length}
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium text-xs sm:text-sm">
                        <span className="text-purple-600 font-bold">
                          {jobs.length}
                        </span>
                        {" / "}
                        <span className="text-purple-600 font-bold">
                          {totalJobs}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center text-xs space-x-1 sm:space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || loading}
                    className="px-2 sm:px-3 py-1.5 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    <span className="hidden sm:inline">Prev</span>
                  </button>
                  <span className="px-2 sm:px-3 py-1.5 text-gray-800 bg-gray-100 rounded-md font-semibold whitespace-nowrap">
                    {currentPage}/{totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || loading}
                    className="px-2 sm:px-3 py-1.5 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 ml-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Job cards with responsive loading state */}
        {loading ? (
          <div className="mt-4 bg-white border border-gray-200 rounded-md p-4 sm:p-6">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <div>
              {/* Job cards grid - responsive */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
                {jobs.length > 0 ? (
                  jobs.map((job) => (
                    <JobCard
                      key={job._id}
                      job={job}
                      onClick={() => handleJobClick(job)}
                    />
                  ))
                ) : (
                  <div className="col-span-1 sm:col-span-2 lg:col-span-3 bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-10 text-center my-4 sm:my-8">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-indigo-100 rounded-full flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 sm:mb-2">
                      No jobs found
                    </h3>
                    <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                      We couldn't find any jobs matching your search criteria.
                    </p>
                    <button
                      onClick={() => {
                        setSearchLocation("");
                        setCurrentPage(1);
                      }}
                      className="inline-flex items-center px-4 py-2 sm:px-5 sm:py-3 border border-transparent text-sm sm:text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                    >
                      Clear Search
                    </button>
                  </div>
                )}
              </div>

              {/* Bottom pagination - responsive */}
              {totalPages > 1 && jobs.length > 0 && (
                <div className="mt-4 sm:mt-6 flex justify-center overflow-x-auto sm:overflow-visible py-2 sm:py-0">
                  <div className="inline-flex rounded-md shadow-sm text-xs sm:text-sm text-gray-700">
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(1);
                      }}
                      className={`px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 rounded-l-md hover:bg-gray-50 transition-colors ${
                        currentPage === 1
                          ? "opacity-50 pointer-events-none"
                          : ""
                      }`}
                    >
                      First
                    </a>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(currentPage - 1);
                      }}
                      className={`px-2 sm:px-3 py-1.5 sm:py-2 border-t border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                        currentPage === 1
                          ? "opacity-50 pointer-events-none"
                          : ""
                      }`}
                    >
                      Prev
                    </a>
                    <span className="px-2 sm:px-3 py-1.5 sm:py-2 border-t border-b border-gray-200 bg-blue-50 text-blue-600 font-semibold whitespace-nowrap">
                      {currentPage} of {totalPages}
                    </span>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(currentPage + 1);
                      }}
                      className={`px-2 sm:px-3 py-1.5 sm:py-2 border-t border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                        currentPage === totalPages
                          ? "opacity-50 pointer-events-none"
                          : ""
                      }`}
                    >
                      Next
                    </a>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(totalPages);
                      }}
                      className={`px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 rounded-r-md hover:bg-gray-50 transition-colors ${
                        currentPage === totalPages
                          ? "opacity-50 pointer-events-none"
                          : ""
                      }`}
                    >
                      Last
                    </a>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Footer - small and minimal, responsive */}
      <footer className="mt-6 sm:mt-8 border-t border-gray-200 pt-3 sm:pt-4 pb-3 sm:pb-4">
        <div className="text-center text-gray-700 text-xs">
          <p className="mb-1">
            © {new Date().getFullYear()} Job Portal. All rights reserved.
          </p>
          <p className="font-medium">
            Find your dream job with our powerful job search platform.
          </p>
        </div>
      </footer>

      {/* Job Modal */}
      <JobModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        job={selectedJob}
      />
    </main>
  );
}

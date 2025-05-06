"use client";

import { useState, useEffect } from "react";
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

  const loadJobs = async (page: number = 1, location: string = "") => {
    try {
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
      setTotalPages(Math.ceil(response.total / 20));
      setTotalJobs(response.total);
    } catch (err) {
      console.error("Error loading jobs:", err);
      setError(err instanceof Error ? err.message : "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs(currentPage, searchLocation);
  }, [currentPage, searchLocation]);

  const handleSearch = (location: string) => {
    setSearchLocation(location);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header with titles side by side */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-indigo-800 tracking-tight">
            Find Your Dream Job
          </h1>
          <p className="text-sm md:text-base text-indigo-600 font-medium">
            Search through thousands of job listings
          </p>
        </div>

        <div className="mt-6 mb-8">
          <SearchBar onSearch={handleSearch} />
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <p className="text-gray-700 font-medium">
                  Showing <span className="text-indigo-600 font-bold">{jobs.length}</span> of{" "}
                  <span className="text-indigo-600 font-bold">{totalJobs}</span> jobs
                </p>
                {totalPages > 1 && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 rounded-md bg-white border border-indigo-300 text-indigo-700 hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-colors duration-200"
                    >
                      Previous
                    </button>
                    <span className="px-3 py-1 text-indigo-700 bg-indigo-50 rounded-md text-sm font-medium">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 rounded-md bg-white border border-indigo-300 text-indigo-700 hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-colors duration-200"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {jobs.map((job) => (
                  <JobCard
                    key={job._id}
                    job={job}
                    onClick={() => handleJobClick(job)}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {/* Job Modal */}
        <JobModal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
          job={selectedJob} 
        />
      </div>
    </main>
  );
}

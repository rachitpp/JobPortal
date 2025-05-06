import React from "react";
import { Job } from "../types/jobs";

interface JobDetailsProps {
  job: Job | null;
}

const JobDetails: React.FC<JobDetailsProps> = ({ job }) => {
  if (!job) {
    return (
      <div className="h-full flex items-center justify-center p-6 text-gray-500">
        <div className="text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 mx-auto text-blue-300 mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <p className="text-sm font-medium">Select a job to view details</p>
        </div>
      </div>
    );
  }

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) {
      return "N/A";
    }
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getPostedDate = () => {
    if (job.postedDate) {
      return formatDate(job.postedDate);
    } else if (job.postedDateTime?.$date) {
      return formatDate(job.postedDateTime.$date);
    } else {
      return "Date not available";
    }
  };

  const getExperience = () => {
    if (job.experienceRange) {
      return job.experienceRange;
    } else if (job.experience) {
      return job.experience;
    } else if (job.min_exp !== undefined && job.max_exp !== undefined) {
      return `${job.min_exp}-${job.max_exp} Years`;
    } else {
      return "Not specified";
    }
  };

  const getEmploymentType = () => {
    return job.employmentType || job.employment_type || "Not specified";
  };

  return (
    <div className="h-full overflow-auto bg-white">
      <div className="details-header">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {job.title || "No Title"}
            </h2>

            {job.company && (
              <div className="text-sm font-semibold text-blue-600 mt-0.5">
                {job.company}
              </div>
            )}
          </div>

          {job.companyImageUrl && (
            <img
              src={job.companyImageUrl}
              alt={job.company || "Company logo"}
              className="h-10 w-10 object-contain border rounded bg-white p-1"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://via.placeholder.com/150?text=No+Image";
              }}
            />
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div className="job-detail-block">
            <div className="job-info-item">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <div className="text-sm">
                <div className="font-bold text-gray-800">Location</div>
                <div className="text-gray-700 font-medium">
                  {job.location || "Location not available"}
                  {job.country && <span className="ml-1">({job.country})</span>}
                </div>
              </div>
            </div>

            <div className="job-info-item">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-blue-600"
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
              <div className="text-sm">
                <div className="font-bold text-gray-800">Employment Type</div>
                <div className="text-gray-700 font-medium">
                  {getEmploymentType()}
                </div>
              </div>
            </div>

            <div className="job-info-item">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="text-sm">
                <div className="font-bold text-gray-800">Experience</div>
                <div className="text-gray-700 font-medium">
                  {getExperience()}
                </div>
              </div>
            </div>
          </div>

          <div className="job-detail-block">
            <div className="job-info-item">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <div className="text-sm">
                <div className="font-bold text-gray-800">Posted Date</div>
                <div className="text-gray-700 font-medium">
                  {getPostedDate()}
                </div>
              </div>
            </div>

            <div className="job-info-item">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <div className="text-sm">
                <div className="font-bold text-gray-800">Source</div>
                <div className="text-gray-700 font-medium">
                  {job.source || "Unknown"}
                </div>
              </div>
            </div>

            {"Job ID (Numeric)" in job && (
              <div className="job-info-item">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0"
                  />
                </svg>
                <div className="text-sm">
                  <div className="font-bold text-gray-800">Job ID</div>
                  <div className="text-gray-700 font-medium">
                    {job["Job ID (Numeric)"]}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {job.job_link && (
          <div className="mb-4">
            <a
              href={job.job_link}
              target="_blank"
              rel="noopener noreferrer"
              className="apply-button"
            >
              Apply on {job.source || "Job Site"}
            </a>
          </div>
        )}

        <div className="job-section">
          <h3 className="section-title">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1.5 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
            Description
          </h3>
          <div className="prose prose-sm max-w-none text-gray-800 text-sm font-medium">
            {job.description || (
              <div className="italic text-gray-500 text-sm">
                No description available for this job.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;

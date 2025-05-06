import React from "react";
import { Job } from "../types/jobs";

interface JobListItemProps {
  job: Job;
  isSelected: boolean;
  onClick: () => void;
}

const JobListItem: React.FC<JobListItemProps> = ({
  job,
  isSelected,
  onClick,
}) => {
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
    <div
      className={`job-card cursor-pointer ${
        isSelected ? "selected" : ""
      } mb-2 mx-1 shadow-sm hover:shadow-md`}
      onClick={onClick}
    >
      <h3 className="job-title">{job.title || "No Title"}</h3>

      {job.company && <div className="job-company">{job.company}</div>}

      <div className="job-location">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3 job-icon"
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
        <span>{job.location || "Location not available"}</span>
      </div>

      <div className="flex gap-5">
        <div className="job-meta">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-2.5 w-2.5 job-icon"
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
          <span>{getEmploymentType()}</span>
        </div>

        <div className="job-meta">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-2.5 w-2.5 job-icon"
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
          <span>{getExperience()}</span>
        </div>
      </div>

      <div className="flex justify-between items-center mt-2">
        <div className="job-date flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-2.5 w-2.5 job-icon mr-1"
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
          {getPostedDate()}
        </div>

        <div className="job-source">{job.source || "Unknown"}</div>
      </div>
    </div>
  );
};

export default JobListItem;

import { Job } from "../types/jobs";
import {
  FiX,
  FiMapPin,
  FiBriefcase,
  FiClock,
  FiCalendar,
  FiExternalLink,
} from "react-icons/fi";
import { useEffect } from "react";

interface JobModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job | null;
}

const JobModal: React.FC<JobModalProps> = ({ isOpen, onClose, job }) => {
  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  if (!isOpen || !job) return null;

  // Format a date into a readable string (e.g., "May 5, 2025")
  const formatDate = (dateString?: string | { $date?: string }) => {
    if (!dateString) return "Recently posted";

    try {
      let date: Date;
      if (typeof dateString === "object" && "$date" in dateString) {
        date = new Date(dateString.$date as string);
      } else if (typeof dateString === "string") {
        date = new Date(dateString);
      } else {
        return "Recently posted";
      }

      if (isNaN(date.getTime())) {
        return "Recently posted";
      }

      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date);
    } catch {
      return "Recently posted";
    }
  };

  // Use company logo or fallback to avatar
  const companyLogo =
    job.companyImageUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      job.company || "Company"
    )}&background=random&color=fff&size=150`;

  // Nicely format experience range
  const experienceText = () => {
    const minExp = job.min_exp;
    const maxExp = job.max_exp;

    if (minExp !== undefined && maxExp !== undefined) {
      if (minExp === maxExp) return `${minExp} years`;
      return `${minExp}-${maxExp} years`;
    }
    if (minExp !== undefined) return `${minExp}+ years`;
    if (maxExp !== undefined) return `Up to ${maxExp} years`;
    return job.experience || "Not specified";
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto backdrop-blur-sm bg-gray-800/70 flex items-center justify-center p-4 transition-all duration-300">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-lg shadow-xl w-full max-w-lg md:max-w-xl max-h-[80vh] overflow-y-auto mx-4 animate-modalFadeIn"
      >
        {/* Close (X) button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors duration-200 z-10"
          aria-label="Close"
        >
          <FiX size={24} />
        </button>

        <div className="p-5 md:p-6">
          {/* Header: company logo and job title */}
          <div className="flex items-start mb-6">
            <div className="mr-4 flex-shrink-0">
              <div
                className="w-14 h-14 md:w-16 md:h-16 rounded-lg bg-gray-100 border border-slate-200 relative overflow-hidden"
                style={{
                  backgroundImage: `url(${companyLogo})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-extrabold text-gray-900 mb-1">
                {job.title || "Untitled Position"}
              </h2>
              <p className="text-sm md:text-base font-bold text-gray-800">
                {job.company || "Unknown Company"}
              </p>
            </div>
          </div>

          {/* Job metadata details */}
          <div className="bg-slate-50 p-4 rounded-lg mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {job.location && (
                <div className="flex items-center text-sm font-bold text-gray-800">
                  <FiMapPin
                    className="mr-3 text-indigo-600 flex-shrink-0"
                    size={18}
                  />
                  <span>{job.location}</span>
                </div>
              )}

              <div className="flex items-center text-sm font-bold text-gray-800">
                <FiBriefcase
                  className="mr-3 text-indigo-600 flex-shrink-0"
                  size={18}
                />
                <span>
                  {job.employmentType || job.employment_type || "Full-time"}
                </span>
              </div>

              <div className="flex items-center text-sm font-bold text-gray-800">
                <FiClock
                  className="mr-3 text-indigo-600 flex-shrink-0"
                  size={18}
                />
                <span>Experience: {experienceText()}</span>
              </div>

              <div className="flex items-center text-sm font-bold text-gray-800">
                <FiCalendar
                  className="mr-3 text-indigo-600 flex-shrink-0"
                  size={18}
                />
                <span>
                  Posted:{" "}
                  {formatDate(job.postedDate || job.postedDateTime?.$date)}
                </span>
              </div>
            </div>
          </div>

          {/* Job description section */}
          {job.description && (
            <div className="mb-6">
              <h3 className="text-md font-bold text-gray-900 mb-2">
                Job Description
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {job.description}
              </p>
            </div>
          )}

          {/* Apply Now button */}
          <div className="flex justify-center mt-8">
            <a
              href={job.job_link || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full flex items-center justify-center px-6 py-3 text-white font-bold rounded-md transition-colors ${
                job.job_link
                  ? "bg-indigo-600 hover:bg-indigo-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              onClick={(e) => {
                if (!job.job_link) {
                  e.preventDefault();
                }
              }}
            >
              <FiExternalLink className="mr-2" />
              Apply Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobModal;

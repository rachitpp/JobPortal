import { Job } from "../types/jobs";
import {
  FiX,
  FiMapPin,
  FiBriefcase,
  FiClock,
  FiCalendar,
  FiExternalLink,
  FiShare2,
  FiBookmark,
} from "react-icons/fi";
import { useEffect, useState } from "react";

interface JobModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job | null;
}

const JobModal: React.FC<JobModalProps> = ({ isOpen, onClose, job }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
      // Trigger animation after modal opens
      setTimeout(() => setAnimateIn(true), 50);
    } else {
      document.body.classList.remove("overflow-hidden");
      setAnimateIn(false);
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
        month: "short",
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

  // Define badge color based on employment type
  const getBadgeColor = () => {
    const type = (
      job.employmentType ||
      job.employment_type ||
      "Full-time"
    ).toLowerCase();
    if (type.includes("full")) return "bg-emerald-100 text-emerald-700";
    if (type.includes("part")) return "bg-amber-100 text-amber-700";
    if (type.includes("contract")) return "bg-purple-100 text-purple-700";
    if (type.includes("intern")) return "bg-blue-100 text-blue-700";
    return "bg-gray-100 text-gray-700";
  };

  const handleSaveJob = () => {
    setIsSaved(!isSaved);
    // In a real app, you would save this to user's saved jobs
  };

  const handleShare = () => {
    // In a real app, you would open a share dialog
    if (navigator.share) {
      navigator
        .share({
          title: job.title || "Job Posting",
          text: `Check out this job: ${job.title} at ${job.company}`,
          url: window.location.href,
        })
        .catch((error) => console.log("Error sharing", error));
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => alert("Link copied to clipboard!"))
        .catch((error) => console.log("Error copying to clipboard", error));
    }
  };

  const handleModalClose = (e: React.MouseEvent) => {
    // Call the onClose function passed from props
    onClose();
  };

  const handleContentClick = (e: React.MouseEvent) => {
    // Prevent clicks inside the modal from closing it
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto backdrop-blur-sm bg-gray-800/70 flex items-center justify-center p-2 sm:p-4 transition-all duration-300"
      onClick={handleModalClose}
    >
      <div
        onClick={handleContentClick}
        className={`relative bg-white rounded-lg shadow-lg w-full max-w-xl max-h-[85vh] overflow-y-auto mx-2 sm:mx-4 transform transition-all duration-300 ${
          animateIn ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        {/* Close (X) button */}
        <button
          onClick={handleModalClose}
          className="absolute right-2 top-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 p-1.5 rounded-full transition-colors duration-200 z-10 flex items-center justify-center cursor-pointer bg-white/80 shadow-sm"
          aria-label="Close modal"
        >
          <FiX size={18} />
        </button>

        {/* Header with company info */}
        <div className="bg-white border-b border-gray-100 p-3 sm:p-4 flex items-center">
          <div className="mr-3 flex-shrink-0">
            <div
              className="w-10 h-10 rounded-md bg-white shadow-sm border border-gray-200 relative overflow-hidden"
              style={{
                backgroundImage: `url(${companyLogo})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          </div>
          <div className="flex-1 min-w-0 pr-8">
            <h2 className="text-base font-bold text-gray-900 mb-0.5 line-clamp-1">
              {job.title || "Untitled Position"}
            </h2>
            <p className="text-xs text-gray-600 font-medium">
              {job.company || "Unknown Company"}
            </p>
          </div>
        </div>

        <div className="p-3 sm:p-4">
          {/* Job metadata in a compact grid */}
          <div className="bg-gray-50 p-2.5 rounded-md mb-3 border border-gray-100 grid grid-cols-2 gap-2 text-xs">
            {job.location && (
              <div className="flex items-center text-gray-700">
                <FiMapPin
                  className="mr-1.5 text-blue-500 flex-shrink-0"
                  size={12}
                />
                <span className="truncate">{job.location}</span>
              </div>
            )}

            <div className="flex items-center text-gray-700">
              <FiBriefcase
                className="mr-1.5 text-blue-500 flex-shrink-0"
                size={12}
              />
              <span
                className={`px-1.5 py-0.5 rounded-full text-2xs font-medium ${getBadgeColor()}`}
              >
                {job.employmentType || job.employment_type || "Full-time"}
              </span>
            </div>

            <div className="flex items-center text-gray-700">
              <FiClock
                className="mr-1.5 text-blue-500 flex-shrink-0"
                size={12}
              />
              <span>{experienceText()}</span>
            </div>

            <div className="flex items-center text-gray-700">
              <FiCalendar
                className="mr-1.5 text-blue-500 flex-shrink-0"
                size={12}
              />
              <span>
                {formatDate(job.postedDate || job.postedDateTime?.$date)}
              </span>
            </div>
          </div>

          {/* Action buttons in a more compact row */}
          <div className="flex mb-3 gap-2">
            <a
              href={job.job_link || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex-1 flex items-center justify-center px-3 py-2 text-white font-medium text-xs rounded-md transition-colors ${
                job.job_link
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              onClick={(e) => {
                if (!job.job_link) {
                  e.preventDefault();
                }
              }}
            >
              <FiExternalLink className="mr-1.5" size={14} />
              Apply Now
            </a>
            <button
              onClick={handleSaveJob}
              className={`p-2 rounded-md border ${
                isSaved
                  ? "bg-amber-50 text-amber-600 border-amber-200"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              } transition-colors`}
              aria-label="Save job"
            >
              <FiBookmark
                size={14}
                className={isSaved ? "fill-amber-500" : ""}
              />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-md bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
              aria-label="Share job"
            >
              <FiShare2 size={14} />
            </button>
          </div>

          {/* Job description section */}
          {job.description && (
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center">
                <span className="bg-blue-500 w-1 h-4 rounded-full mr-1.5 inline-block"></span>
                Job Description
              </h3>
              <div className="text-xs text-gray-700 leading-relaxed space-y-1.5 pl-2.5 pr-1 max-h-60 overflow-y-auto">
                {job.description.split("\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          )}

          {/* Source info */}
          {job.source && (
            <div className="mt-3 pt-2 border-t border-gray-100 text-2xs text-gray-500">
              <p>Source: {job.source}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobModal;

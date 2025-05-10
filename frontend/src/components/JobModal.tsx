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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto backdrop-blur-sm bg-gray-800/70 flex items-center justify-center p-2 sm:p-4 transition-all duration-300">
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-y-auto mx-2 sm:mx-4 transform transition-all duration-300 ${
          animateIn ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        {/* Close (X) button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 sm:right-4 sm:top-4 text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-1.5 sm:p-2 rounded-full transition-colors duration-200 z-10"
          aria-label="Close"
        >
          <FiX size={18} />
        </button>

        {/* Company banner/header with gradient */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-4 sm:p-6 rounded-t-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 bottom-0 left-0 bg-gradient-to-r from-black/20 to-transparent"></div>
          <div className="relative z-10 flex items-center">
            <div className="mr-3 sm:mr-4 flex-shrink-0">
              <div
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-white shadow-md border-2 border-white relative overflow-hidden"
                style={{
                  backgroundImage: `url(${companyLogo})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-1 line-clamp-2">
                {job.title || "Untitled Position"}
              </h2>
              <p className="text-indigo-100 font-medium text-sm sm:text-base">
                {job.company || "Unknown Company"}
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {/* Action buttons */}
          <div className="flex mb-5 sm:mb-6 gap-2">
            <a
              href={job.job_link || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex-1 flex items-center justify-center px-3 sm:px-4 py-2.5 sm:py-3 text-white font-medium text-sm sm:text-base rounded-md transition-colors ${
                job.job_link
                  ? "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              onClick={(e) => {
                if (!job.job_link) {
                  e.preventDefault();
                }
              }}
            >
              <FiExternalLink className="mr-1.5 sm:mr-2" />
              Apply Now
            </a>
            <button
              onClick={handleSaveJob}
              className={`p-2.5 sm:p-3 rounded-md border ${
                isSaved
                  ? "bg-amber-50 text-amber-600 border-amber-200"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 active:bg-gray-100"
              } transition-colors`}
              aria-label="Save job"
            >
              <FiBookmark
                size={18}
                className={isSaved ? "fill-amber-500" : ""}
              />
            </button>
            <button
              onClick={handleShare}
              className="p-2.5 sm:p-3 rounded-md bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 active:bg-gray-100 transition-colors"
              aria-label="Share job"
            >
              <FiShare2 size={18} />
            </button>
          </div>

          {/* Job metadata details */}
          <div className="bg-indigo-50 p-3 sm:p-4 rounded-lg mb-5 sm:mb-6 border border-indigo-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {job.location && (
                <div className="flex items-center text-xs sm:text-sm font-medium text-gray-800">
                  <div className="mr-2.5 sm:mr-3 bg-indigo-100 p-1.5 sm:p-2 rounded-full text-indigo-600">
                    <FiMapPin size={14} />
                  </div>
                  <span>{job.location}</span>
                </div>
              )}

              <div className="flex items-center text-xs sm:text-sm font-medium text-gray-800">
                <div className="mr-2.5 sm:mr-3 bg-indigo-100 p-1.5 sm:p-2 rounded-full text-indigo-600">
                  <FiBriefcase size={14} />
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-2xs sm:text-xs font-medium ${getBadgeColor()}`}
                >
                  {job.employmentType || job.employment_type || "Full-time"}
                </span>
              </div>

              <div className="flex items-center text-xs sm:text-sm font-medium text-gray-800">
                <div className="mr-2.5 sm:mr-3 bg-indigo-100 p-1.5 sm:p-2 rounded-full text-indigo-600">
                  <FiClock size={14} />
                </div>
                <span>Experience: {experienceText()}</span>
              </div>

              <div className="flex items-center text-xs sm:text-sm font-medium text-gray-800">
                <div className="mr-2.5 sm:mr-3 bg-indigo-100 p-1.5 sm:p-2 rounded-full text-indigo-600">
                  <FiCalendar size={14} />
                </div>
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
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                <span className="bg-indigo-100 w-1.5 h-6 rounded-full mr-2 inline-block"></span>
                Job Description
              </h3>
              <div className="text-sm text-gray-700 leading-relaxed space-y-2 pl-4">
                {job.description.split("\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          )}

          {/* Source and disclaimer */}
          {job.source && (
            <div className="mt-6 pt-4 border-t border-gray-200 text-xs text-gray-500">
              <p>Source: {job.source}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobModal;

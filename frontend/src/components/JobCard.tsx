import { Job } from "../types/jobs";
import {
  FiMapPin,
  FiBriefcase,
  FiClock,
  FiCalendar,
  FiArrowRight,
} from "react-icons/fi";

interface JobCardProps {
  job: Job;
  onClick: () => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onClick }) => {
  // Convert posted date to a friendly relative string (e.g., "2 days ago")
  const getRelativeTime = (dateString?: string) => {
    if (!dateString) return "Recently";

    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 30) return `${diffInDays} days ago`;
    if (diffInDays < 365) {
      const months = Math.floor(diffInDays / 30);
      return `${months} ${months === 1 ? "month" : "months"} ago`;
    }
    return `${Math.floor(diffInDays / 365)} year(s) ago`;
  };

  // Build the company logo URL or use a fallback avatar
  const companyLogo =
    job.companyImageUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      job.company || "Company"
    )}&background=random&color=fff`;

  // Normalize employment type from API data
  const employmentType =
    job.employmentType || job.employment_type || "Full-time";

  // Format the experience range text nicely
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
    const type = employmentType.toLowerCase();
    if (type.includes("full")) return "bg-emerald-100 text-emerald-700";
    if (type.includes("part")) return "bg-amber-100 text-amber-700";
    if (type.includes("contract")) return "bg-purple-100 text-purple-700";
    if (type.includes("intern")) return "bg-blue-100 text-blue-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div
      className="bg-white rounded-xl border border-slate-200 p-3.5 sm:p-5 hover:shadow-md hover:border-indigo-300 transition-all duration-300 cursor-pointer flex flex-col h-full group active:bg-slate-50"
      onClick={onClick}
    >
      {/* Top section: logo and job title */}
      <div className="flex items-start mb-3 sm:mb-4">
        <div className="flex-shrink-0 mr-3">
          <div
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg border border-slate-200 relative overflow-hidden group-hover:shadow-md transition-all duration-300"
            style={{
              backgroundImage: `url(${companyLogo})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-gray-900 line-clamp-2 leading-tight mb-0.5 sm:mb-1 text-sm sm:text-base group-hover:text-indigo-700 transition-colors duration-200">
            {job.title || "Untitled Position"}
          </h3>
          <p className="text-xs sm:text-sm font-medium text-gray-700 line-clamp-1">
            {job.company || "Unknown Company"}
          </p>
          <div className="mt-1">
            <span
              className={`text-2xs sm:text-xs py-0.5 px-1.5 sm:px-2 rounded-full font-medium ${getBadgeColor()}`}
            >
              {employmentType}
            </span>
          </div>
        </div>
      </div>

      {/* Middle section: job details */}
      <div className="space-y-2 mt-auto bg-slate-50 p-2.5 sm:p-3 rounded-lg border border-slate-100 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors duration-300">
        {job.location && (
          <div className="flex items-center text-2xs sm:text-xs font-medium text-gray-700">
            <FiMapPin
              className="mr-1.5 sm:mr-2 text-indigo-500 flex-shrink-0"
              size={12}
            />
            <span className="truncate">{job.location}</span>
          </div>
        )}

        <div className="flex items-center text-2xs sm:text-xs font-medium text-gray-700">
          <FiClock
            className="mr-1.5 sm:mr-2 text-indigo-500 flex-shrink-0"
            size={12}
          />
          <span>{experienceText()}</span>
        </div>
      </div>

      {/* Bottom section: posted date and action button */}
      <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-slate-100 flex justify-between items-center">
        <div className="flex items-center text-2xs sm:text-xs font-medium text-gray-500">
          <FiCalendar
            className="mr-1 sm:mr-1.5 text-indigo-400 flex-shrink-0"
            size={12}
          />
          <span>{getRelativeTime(job.postedDate)}</span>
        </div>
        <span className="flex items-center text-2xs sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 bg-indigo-600 text-white font-medium rounded-md group-hover:bg-indigo-700 transition-colors duration-200 active:bg-indigo-800">
          View
          <FiArrowRight
            className="ml-1 group-hover:translate-x-0.5 transition-transform duration-200"
            size={12}
          />
        </span>
      </div>
    </div>
  );
};

export default JobCard;

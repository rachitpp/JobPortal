import { Job } from "../types/jobs";
import { FiMapPin, FiBriefcase, FiClock, FiCalendar } from "react-icons/fi";

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

  return (
    <div
      className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 hover:shadow-lg hover:border-indigo-200 transition-all duration-300 cursor-pointer flex flex-col h-full"
      onClick={onClick}
    >
      {/* Top section: logo and job title */}
      <div className="flex items-start mb-3">
        <div className="flex-shrink-0 mr-3">
          <div
            className="w-12 h-12 rounded-lg bg-gray-100 border border-slate-200 relative overflow-hidden"
            style={{
              backgroundImage: `url(${companyLogo})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-extrabold text-gray-900 line-clamp-2 leading-tight mb-1 text-sm sm:text-base">
            {job.title || "Untitled Position"}
          </h3>
          <p className="text-xs sm:text-sm font-bold text-gray-800 line-clamp-1">
            {job.company || "Unknown Company"}
          </p>
        </div>
      </div>

      {/* Middle section: job details */}
      <div className="space-y-2.5 mt-auto bg-slate-50 p-3 rounded-lg">
        {job.location && (
          <div className="flex items-center text-xs font-bold text-gray-800">
            <FiMapPin className="mr-2 text-indigo-600 flex-shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
        )}

        <div className="flex items-center text-xs font-bold text-gray-800">
          <FiBriefcase className="mr-2 text-indigo-600 flex-shrink-0" />
          <span>{employmentType}</span>
        </div>

        <div className="flex items-center text-xs font-bold text-gray-800">
          <FiClock className="mr-2 text-indigo-600 flex-shrink-0" />
          <span>{experienceText()}</span>
        </div>
      </div>

      {/* Bottom section: posted date and action button */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
        <div className="flex items-center text-xs font-bold text-gray-800">
          <FiCalendar className="mr-1.5 text-indigo-600 flex-shrink-0" />
          <span>{getRelativeTime(job.postedDate)}</span>
        </div>
        <span className="text-xs px-3 py-1.5 bg-indigo-600 text-white font-bold rounded-md hover:bg-indigo-700 transition-colors duration-200">
          View Details
        </span>
      </div>
    </div>
  );
};

export default JobCard;

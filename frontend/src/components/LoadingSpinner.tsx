import React, { useState, useEffect } from "react";

const LoadingSpinner: React.FC = () => {
  const [showExtendedMessage, setShowExtendedMessage] = useState(false);

  useEffect(() => {
    // Show extended message after 3 seconds to indicate potential cold start
    const timer = setTimeout(() => {
      setShowExtendedMessage(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-4 sm:py-6">
      <div className="relative">
        <svg
          width="30"
          height="30"
          viewBox="0 0 40 40"
          className="stroke-current text-blue-500 sm:w-9 sm:h-9"
        >
          <circle
            cx="20"
            cy="20"
            r="16"
            fill="none"
            strokeWidth="3"
            strokeLinecap="round"
            className="opacity-25"
          />
          <circle
            cx="20"
            cy="20"
            r="16"
            fill="none"
            strokeWidth="3"
            strokeDasharray="100"
            strokeDashoffset="50"
            strokeLinecap="round"
            className="opacity-75 animate-[dash_1.5s_ease-in-out_infinite]"
          />
        </svg>
      </div>
      <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-700 font-medium">
        Loading jobs...
      </p>

      {showExtendedMessage && (
        <p className="mt-1 text-xs text-gray-500 max-w-xs text-center">
          The server might be starting up after inactivity. This could take a
          moment...
        </p>
      )}

      <style jsx>{`
        @keyframes dash {
          0% {
            stroke-dashoffset: 100;
            transform: rotate(0deg);
          }
          50% {
            stroke-dashoffset: 25;
          }
          100% {
            stroke-dashoffset: 100;
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;

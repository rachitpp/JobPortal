import React from "react";
import { FiAlertTriangle, FiRefreshCw } from "react-icons/fi";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-3 sm:px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-4 sm:p-6">
        <div className="flex items-center justify-center mb-3 sm:mb-4">
          <div className="h-10 w-10 sm:h-12 sm:w-12 bg-red-50 rounded-full flex items-center justify-center">
            <FiAlertTriangle className="h-6 w-6 sm:h-7 sm:w-7 text-red-500" />
          </div>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-2 sm:mb-4">
          Oops! Something went wrong
        </h2>
        <p className="text-sm sm:text-base text-gray-600 text-center mb-4 sm:mb-6">
          {message}
        </p>
        {onRetry && (
          <div className="flex justify-center">
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 active:bg-blue-800 transition-colors flex items-center"
            >
              <FiRefreshCw className="mr-1.5 h-4 w-4" />
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;

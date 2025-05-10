import { useState, useEffect, useRef } from "react";
import { FiSearch, FiMapPin } from "react-icons/fi";

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialValue?: string;
  debounceTime?: number;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  initialValue = "",
  debounceTime = 500, // Default debounce time of 500ms
}) => {
  const [searchQuery, setSearchQuery] = useState<string>(initialValue);
  const [debouncedQuery, setDebouncedQuery] = useState<string>(initialValue);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const initialRenderRef = useRef(true);

  // Clean up the timeout when the component unmounts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Trigger initial search when component mounts
  useEffect(() => {
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      onSearch(initialValue);
    }
  }, [initialValue, onSearch]);

  // Effect to handle the debounced search
  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Only trigger search if query is empty (to show all jobs) or has at least 3 characters
    if (
      searchQuery !== debouncedQuery &&
      (searchQuery.length === 0 || searchQuery.length >= 3)
    ) {
      timeoutRef.current = setTimeout(() => {
        setDebouncedQuery(searchQuery);
        onSearch(searchQuery);
        timeoutRef.current = null;
      }, debounceTime);
    }
  }, [searchQuery, debounceTime, onSearch, debouncedQuery]);

  const handleClearSearch = () => {
    setSearchQuery("");
    setDebouncedQuery("");
    onSearch("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center w-full">
      <div
        className={`relative flex-grow w-full mb-2 sm:mb-0 ${
          isFocused
            ? "ring-2 ring-blue-300 rounded-md sm:rounded-r-none sm:rounded-l-md"
            : ""
        }`}
      >
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <FiMapPin size={16} className={isFocused ? "text-blue-500" : ""} />
        </div>
        <input
          ref={inputRef}
          type="text"
          placeholder="Enter job location..."
          className="w-full py-2.5 px-4 pl-9 text-gray-800 bg-white rounded-md sm:rounded-r-none sm:rounded-l-md focus:outline-none text-sm font-medium border-0"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {searchQuery && (
          <button
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none p-1"
            aria-label="Clear search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;

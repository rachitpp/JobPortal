import { useState } from "react";
import { FiSearch } from "react-icons/fi";

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialValue?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  initialValue = "",
}) => {
  const [searchQuery, setSearchQuery] = useState<string>(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto">
      <div className="flex items-center border-2 border-indigo-300 bg-white rounded-md overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="pl-3 pr-2 text-indigo-500">
          <FiSearch size={18} />
        </div>
        <input
          type="text"
          placeholder="Search jobs by location (e.g., New York, Remote)"
          className="w-full py-2 px-2 text-gray-800 text-sm font-medium focus:outline-none placeholder-gray-400"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 text-sm font-semibold hover:bg-indigo-700 transition-colors duration-300 h-full"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;

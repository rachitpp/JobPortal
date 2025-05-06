interface FiltersProps {
  onChange: (filters: { experience: string; employmentType: string }) => void;
  currentFilters: {
    experience: string;
    employmentType: string;
  };
}

const Filters: React.FC<FiltersProps> = ({ onChange, currentFilters }) => {
  const handleFilterChange = (
    key: keyof typeof currentFilters,
    value: string
  ) => {
    onChange({
      ...currentFilters,
      [key]: value,
    });
  };

  return (
    <div>
      {/* Experience Filter */}
      <div>
        <label className="block text-sm font-bold text-gray-800 mb-2">
          Experience
        </label>
        <select
          className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm font-medium"
          value={currentFilters.experience}
          onChange={(e) => handleFilterChange("experience", e.target.value)}
        >
          <option value="all">All Experience Levels</option>
          <option value="0-1">0-1 years</option>
          <option value="1-3">1-3 years</option>
          <option value="3-5">3-5 years</option>
          <option value="5-10">5-10 years</option>
          <option value="10">10+ years</option>
        </select>
      </div>
    </div>
  );
};

export default Filters;

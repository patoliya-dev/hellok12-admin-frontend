import { useState } from "react";
import Select from "components/ui/Select";
import Input from "components/ui/Input";
import { priceRangeOptions, statusOptions, trialOptions } from "../data";
import { languageOptions } from "../../../../utils/utils";

const CourseFilter = ({ filters, onFiltersChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleFilterChange = (key, value) => {
    const updatedFilters = { ...localFilters, [key]: value };
    setLocalFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const handleDateRangeChange = (type, value) => {
    const updatedFilters = {
      ...localFilters,
      dateRange: {
        ...localFilters?.dateRange,
        [type]: value,
      },
    };
    setLocalFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  return (
    <section className="my-8">
      <div className="bg-card border border-border rounded-lg flex flex-col sm:flex-row gap-8 items-center p-6 flex-wrap lg:flex-nowrap">
        <Select
          label="Language"
          placeholder="Select an option"
          value={localFilters?.language}
          options={[{ value: "", label: "All Languages" }, ...languageOptions]}
          onChange={(value) => handleFilterChange("language", value)}
          className="w-full"
          searchable
        />
        <Select
          label="Status"
          placeholder="Select an option"
          value={localFilters?.status}
          options={statusOptions}
          onChange={(value) => handleFilterChange("status", value)}
          className="w-full"
        />
        <Select
          label="Price Range"
          placeholder="Select an option"
          value={localFilters?.priceRange}
          options={priceRangeOptions}
          onChange={(value) => handleFilterChange("priceRange", value)}
          className="w-full"
        />
        <Select
          label="Trial Available"
          placeholder="Select an option"
          value={localFilters?.isTrialAvailable}
          options={trialOptions}
          onChange={(value) => handleFilterChange("isTrialAvailable", value)}
          className="w-full"
        />
        <Input
          label="Start Date"
          type="date"
          value={localFilters?.dateRange?.start}
          onChange={(e) => handleDateRangeChange("start", e?.target?.value)}
          className="w-full border-border"
        />
        <Input
          label="End Date"
          type="date"
          value={localFilters?.dateRange?.end}
          onChange={(e) => handleDateRangeChange("end", e?.target?.value)}
          className="w-full border-border"
        />
      </div>
    </section>
  );
};

export default CourseFilter;

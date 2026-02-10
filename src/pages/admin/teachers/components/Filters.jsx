import {
  experienceOptions,
  languagesOptions,
  statusOptions,
  availabilityOptions,
} from "../data";
import Select from "components/ui/Select";
import Button from "components/ui/Button";

const Filters = ({ filters, onFilterChange, onClearFilters }) => {
  return (
    <section className="mb-8 flex justify-between items-center">
      <div className="flex items-center flex-wrap gap-6">
        <Select
          label="Status"
          options={statusOptions}
          value={filters?.status}
          onChange={(value) => onFilterChange("status", value)}
          className="w-full sm:w-[180px]"
        />
        <Select
          label="Languages"
          options={languagesOptions}
          value={filters?.language}
          searchable
          className="w-full sm:w-[180px]"
          onChange={(value) => onFilterChange("language", value)}
        />
        <Select
          label="Teachings Method"
          options={availabilityOptions}
          value={filters?.availability}
          onChange={(value) => onFilterChange("availability", value)}
          className="w-full sm:w-[180px]"
        />
        <Select
          label="Experience"
          options={experienceOptions}
          value={filters?.experience}
          onChange={(value) => onFilterChange("experience", value)}
          className="w-full sm:w-[180px]"
        />
      </div>

      {(filters?.status !== "all" ||
        filters?.language !== "" ||
        filters?.availability !== "all" ||
        filters?.experience !== "all") && (
        <Button variant="outline" size="sm" onClick={onClearFilters}>
          Clear
        </Button>
      )}
    </section>
  );
};

export default Filters;

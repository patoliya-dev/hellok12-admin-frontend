import React, { useMemo } from "react";
import { languagesOptions, statusOptions, ageRangeOptions } from "../data";
import Select from "components/ui/Select";
import Button from "components/ui/Button";

const Filters = ({
  filters,
  onFiltersChange,
  onClearFilters,
  schoolOptions = [{ value: "all", label: "All Schools" }],
  schoolsLoading = false,
  showAgeRange = true,
}) => {
  const hasActiveFilters = useMemo(() => {
    if (!filters) return false;

    const schoolActive = (filters.school || "all") !== "all";
    const langActive = (filters.language || "") !== "";
    const ageActive = showAgeRange && (filters.ageRange || "") !== "";
    const statusActive = (filters.status || "all") !== "all";

    return schoolActive || langActive || ageActive || statusActive;
  }, [filters, showAgeRange]);

  const setField = (key, value) => {
    onFiltersChange?.({ ...filters, [key]: value });
  };

  return (
    <section className="w-full">
      <div className="w-full flex items-center flex-wrap gap-6">
        <Select
          label="School"
          options={schoolOptions}
          value={filters?.school ?? "all"}
          onChange={(value) => setField("school", value)}
          className="w-full sm:w-[180px]"
          disabled={schoolsLoading}
          loading={schoolsLoading}
        />

        <Select
          label="Languages"
          options={languagesOptions}
          value={filters?.language ?? ""}
          searchable
          className="w-full sm:w-[180px]"
          onChange={(value) => setField("language", value)}
        />

        {showAgeRange && (
          <Select
            label="Students Age Range"
            value={filters?.ageRange ?? ""}
            onChange={(value) => setField("ageRange", value)}
            options={ageRangeOptions}
            className="w-full sm:w-[180px]"
          />
        )}

        <Select
          label="Status"
          options={statusOptions}
          value={filters?.status ?? "all"}
          onChange={(value) => setField("status", value)}
          className="w-full sm:w-[180px]"
        />

        <div className="ml-auto">
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={onClearFilters}>
              Clear
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default Filters;

import React, { useMemo } from "react";
import Select from "components/ui/Select";
import Button from "components/ui/Button";

const statusOptions = [
  { value: "all", label: "Select status" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "pending", label: "Pending" },
];

const expOptions = [
  { value: "all", label: "Select Experience" },
  { value: "0-2", label: "0-2 Years" },
  { value: "3-5", label: "3-5 Years" },
  { value: "5+", label: "5+ Years" },
];

const TeachersFilters = ({
  type = "school", // school | independent
  filters,
  onFiltersChange,
  onClearFilters,
  schoolOptions = [{ value: "all", label: "Select school" }],
  schoolsLoading = false,
}) => {
  const showSchool = type === "school";

  const hasActive = useMemo(() => {
    if (!filters) return false;
    const s = (filters.status || "all") !== "all";
    const e = (filters.experience || "all") !== "all";
    const sc = showSchool ? (filters.school || "all") !== "all" : false;
    return s || e || sc;
  }, [filters, showSchool]);

  const setField = (k, v) => {
    onFiltersChange?.({ ...filters, [k]: v });
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 w-full">
      <div
        className={`grid gap-6 w-full ${
          showSchool
            ? "grid-cols-1 md:grid-cols-3"
            : "grid-cols-1 md:grid-cols-2"
        }`}
      >
        {showSchool ? (
          <Select
            label="School"
            options={schoolOptions}
            value={filters?.school ?? "all"}
            onChange={(v) => setField("school", v)}
            disabled={schoolsLoading}
            loading={schoolsLoading}
            className="w-full"
          />
        ) : null}

        <Select
          label="Years of Experience"
          options={expOptions}
          value={filters?.experience ?? "all"}
          onChange={(v) => setField("experience", v)}
          className="w-full"
        />

        <Select
          label="Status"
          options={statusOptions}
          value={filters?.status ?? "all"}
          onChange={(v) => setField("status", v)}
          className="w-full"
        />
      </div>

      {hasActive ? (
        <div className="flex justify-end mt-5">
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            Clear
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default TeachersFilters;

import React, { useState } from "react";
import Input from "../../../../components/ui/Input";
import Select from "../../../../components/ui/Select";
import Button from "../../../../components/ui/Button";
import Icon from "../../../../components/AppIcon";

const LessonFilters = ({ filters, onFiltersChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const statusOptions = [
    { value: "all", label: "All Sessions" },
    { value: "SCHEDULED", label: "Scheduled" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "COMPLETED", label: "Completed" },
    { value: "CANCELLED", label: "Cancelled" },
  ];

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

  const clearFilters = () => {
    const clearedFilters = {
      status: "all",
      studentName: "",
      dateRange: { start: "", end: "" },
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-end gap-4">
        {/* Date Range */}
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <Input
            label="Start Date"
            type="date"
            value={localFilters?.dateRange?.start}
            onChange={(e) => handleDateRangeChange("start", e?.target?.value)}
            className="lg:w-48 border-border"
          />
          <Input
            label="End Date"
            type="date"
            value={localFilters?.dateRange?.end}
            onChange={(e) => handleDateRangeChange("end", e?.target?.value)}
            className="lg:w-48 border-border"
          />
        </div>

        {/* Status Filter */}
        <div className="flex-1 lg:max-w-xs">
          <Select
            label="Status"
            options={statusOptions}
            value={localFilters?.status}
            onChange={(value) => handleFilterChange("status", value)}
          />
        </div>

        {/* Student Search */}
        <div className="flex-1 lg:max-w-xs">
          <Input
            label="Student Name"
            type="search"
            placeholder="Search by student name..."
            value={localFilters?.studentName}
            onChange={(e) =>
              handleFilterChange("studentName", e?.target?.value)
            }
            className="border-border"
          />
        </div>

        {/* Action Button */}
        <Button
          variant="outline"
          onClick={clearFilters}
          iconName="X"
          iconPosition="left"
        >
          Clear
        </Button>
      </div>
      {/* Active Filters Summary */}
      {(localFilters?.status !== "all" ||
        localFilters?.studentName ||
        localFilters?.dateRange?.start ||
        localFilters?.dateRange?.end) && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground">
              Active filters:
            </span>
            {localFilters?.status !== "all" && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                Status:{" "}
                {
                  statusOptions?.find(
                    (opt) => opt?.value === localFilters?.status,
                  )?.label
                }
                <button onClick={() => handleFilterChange("status", "all")}>
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            {localFilters?.studentName && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                Student: {localFilters?.studentName}
                <button onClick={() => handleFilterChange("studentName", "")}>
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            {(localFilters?.dateRange?.start ||
              localFilters?.dateRange?.end) && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                Date Range
                <button
                  onClick={() =>
                    handleDateRangeChange("start", "") ||
                    handleDateRangeChange("end", "")
                  }
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonFilters;

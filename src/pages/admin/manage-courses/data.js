const priceRangeOptions = [
  { value: "", label: "Any Price" },
  { value: "0-50", label: "$0 - $50" },
  { value: "51-100", label: "$51 - $100" },
  { value: "101-200", label: "$101 - $200" },
  { value: "201-500", label: "$201 - $500" },
  { value: "500+", label: "$500+" },
];

const statusOptions = [
  { value: "", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" },
  { value: "full", label: "Full" },
];

const trialOptions = [
  { value: "", label: "All Courses" },
  { value: "yes", label: "Trial Available" },
  { value: "no", label: "No Trial" },
];

export { priceRangeOptions, statusOptions, trialOptions };

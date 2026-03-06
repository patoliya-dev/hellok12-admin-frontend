import React from "react";

const colorClasses = {
  blue: "bg-blue-100 text-blue-800",
  green: "bg-green-100 text-green-800",
  orange: "bg-orange-100 text-orange-800",
  sky: "bg-[#DDF2FF] text-[#009DFF]",
};

const Badge = ({ text, color, icon }) => {
  return (
    <span
      className={`flex px-3 py-1.5 text-xs font-medium rounded-full items-center ${colorClasses[color]}`}
    >
      <span className="mr-1">{icon}</span> {text}
    </span>
  );
};

export default Badge;

import React from "react";
import { Link } from "react-router-dom";
import Icon from "../AppIcon";

const Breadcrumb = ({ customPath = null, className = "" }) => {
  const generateBreadcrumbs = () => {
    if (customPath) {
      return customPath;
    }
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs?.length <= 1) {
    return null;
  }

  return (
    <nav
      className={`flex items-center space-x-2 text-sm text-text-secondary mb-6 ${className}`}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-2">
        {breadcrumbs?.map((crumb, index) => (
          <li
            key={`${crumb?.path ?? crumb?.label}-${index}`}
            className="flex items-center"
          >
            {index > 0 && (
              <Icon
                name="ChevronRight"
                size={14}
                className="mx-2 text-text-secondary"
              />
            )}
            {crumb?.current ? (
              <span className="text-foreground font-medium" aria-current="page">
                {crumb?.label}
              </span>
            ) : crumb?.onClick ? (
              <button
                type="button"
                onClick={crumb?.onClick}
                className="hover:text-foreground transition-smooth"
              >
                {crumb?.label}
              </button>
            ) : (
              <Link
                to={crumb?.path}
                className="hover:text-foreground transition-smooth"
              >
                {crumb?.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;

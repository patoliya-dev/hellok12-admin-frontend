import React from "react";
import Button from "./Button";

const PAGE_SIZE = 10;

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  isBorderTop = true,
  pageSize = PAGE_SIZE,
  listType = "items",
}) => {
  const safeTotalPages = Math.max(1, Number(totalPages) || 1);
  const safeCurrentPage = Math.min(
    Math.max(1, Number(currentPage) || 1),
    safeTotalPages,
  );
  const safePageSize = Math.max(1, Number(pageSize) || PAGE_SIZE);
  const safeTotalItems = Math.max(0, Number(totalItems) || 0);

  const startItem =
    safeTotalItems === 0 ? 0 : (safeCurrentPage - 1) * safePageSize + 1;
  const endItem =
    safeTotalItems === 0
      ? 0
      : Math.min(safeCurrentPage * safePageSize, safeTotalItems);

  const getVisiblePages = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (safeTotalPages <= maxVisiblePages) {
      for (let i = 1; i <= safeTotalPages; i++) {
        pages?.push(i);
      }
    } else {
      if (safeCurrentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages?.push(i);
        }
        pages?.push("...");
        pages?.push(safeTotalPages);
      } else if (safeCurrentPage >= safeTotalPages - 2) {
        pages?.push(1);
        pages?.push("...");
        for (let i = safeTotalPages - 3; i <= safeTotalPages; i++) {
          pages?.push(i);
        }
      } else {
        pages?.push(1);
        pages?.push("...");
        for (let i = safeCurrentPage - 1; i <= safeCurrentPage + 1; i++) {
          pages?.push(i);
        }
        pages?.push("...");
        pages?.push(safeTotalPages);
      }
    }

    return pages;
  };

  if (safeTotalPages === 0) return null;

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-card ${
        isBorderTop && "border-t border-border"
      }`}
    >
      {/* Results Info */}
      <div className="text-sm text-muted-foreground">
        Showing {startItem} to {endItem} of {totalItems} {listType}
      </div>
      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(safeCurrentPage - 1)}
          disabled={safeCurrentPage === 1}
          iconName="ChevronLeft"
          iconPosition="left"
        >
          Previous
        </Button>

        {/* Page Numbers */}
        <div className="hidden sm:flex items-center gap-1">
          {getVisiblePages()?.map((page, index) => (
            <React.Fragment key={index}>
              {page === "..." ? (
                <span className="px-3 py-2 text-muted-foreground">...</span>
              ) : (
                <Button
                  variant={safeCurrentPage === page ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onPageChange(page)}
                  className="min-w-[40px]"
                >
                  {page}
                </Button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Mobile Page Info */}
        <div className="sm:hidden px-3 py-2 text-sm text-muted-foreground">
          Page {safeCurrentPage} of {safeTotalPages}
        </div>

        {/* Next Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(safeCurrentPage + 1)}
          disabled={safeCurrentPage === safeTotalPages}
          iconName="ChevronRight"
          iconPosition="right"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Pagination;

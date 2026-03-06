import React from "react";
import Icon from "components/AppIcon";

const money = (n) =>
  Number(n || 0).toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

const Th = ({ children, right, className = "" }) => (
  <th
    className={`text-left p-4 text-sm font-medium text-muted-foreground ${right ? "text-right" : ""} ${className}`}
  >
    {children}
  </th>
);

const Td = ({ children, right, className = "" }) => (
  <td
    className={`p-4 text-sm text-foreground ${right ? "text-right" : ""} ${className}`}
  >
    {children}
  </td>
);

const SortableTh = ({ children, right, sortKey, sortConfig, onSort }) => {
  const isActive = sortConfig?.key === sortKey;
  const direction = isActive ? sortConfig?.direction : null;

  return (
    <th
      className={`p-4 text-sm font-medium ${right ? "text-right" : "text-left"}`}
    >
      <button
        type="button"
        onClick={() => onSort?.(sortKey)}
        className={`inline-flex items-center gap-1 ${right ? "ml-auto" : ""} ${
          isActive
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <span>{children}</span>
        <Icon
          name={
            direction === "asc"
              ? "ArrowUp"
              : direction === "desc"
                ? "ArrowDown"
                : "ArrowUpDown"
          }
          size={14}
        />
      </button>
    </th>
  );
};

const FinancialTable = ({
  tab,
  rows,
  sortConfig,
  onSort,
  onRevenueDownload,
  onCommissionDownload,
}) => {
  const onDownload = (r) => {
    if (tab === "revenue") {
      if (!r?.courseId) return;
      onRevenueDownload?.(r);
      return;
    }
    if (tab === "commission") {
      if (!r?.courseId) return;
      onCommissionDownload?.(r);
      return;
    }

    const url = String(r?.downloadUrl || "").trim();
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const canDownload = (r) => {
    if (tab === "revenue" || tab === "commission") return Boolean(r?.courseId);
    return Boolean(String(r?.downloadUrl || "").trim());
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-background">
          <tr className="border-t border-border">
            {tab === "payout" ? (
              <>
                <Th>Instructor</Th>
                <SortableTh
                  right
                  sortKey="amount"
                  sortConfig={sortConfig}
                  onSort={onSort}
                >
                  Amount
                </SortableTh>
                <Th>Transaction ID</Th>
                <Th right>Actions</Th>
              </>
            ) : tab === "revenue" ? (
              <>
                <Th>Course</Th>
                <SortableTh
                  right
                  sortKey="amount"
                  sortConfig={sortConfig}
                  onSort={onSort}
                >
                  Amount
                </SortableTh>
                <SortableTh
                  right
                  sortKey="transactions"
                  sortConfig={sortConfig}
                  onSort={onSort}
                >
                  Transactions
                </SortableTh>
                <Th right>Actions</Th>
              </>
            ) : (
              <>
                <Th>Course</Th>
                <SortableTh
                  right
                  sortKey="enrollments"
                  sortConfig={sortConfig}
                  onSort={onSort}
                >
                  Enrollments
                </SortableTh>
                {/* <SortableTh
                  right
                  sortKey="rate"
                  sortConfig={sortConfig}
                  onSort={onSort}
                >
                  Rate
                </SortableTh> */}
                <SortableTh
                  right
                  sortKey="earned"
                  sortConfig={sortConfig}
                  onSort={onSort}
                >
                  Earned
                </SortableTh>
                <SortableTh
                  right
                  sortKey="date"
                  sortConfig={sortConfig}
                  onSort={onSort}
                >
                  Date
                </SortableTh>
                <Th right>Actions</Th>
              </>
            )}
          </tr>
        </thead>

        <tbody>
          {(rows || []).map((r, idx) => (
            <tr
              key={r?.courseId || r?.transactionId || `${tab}-${idx}`}
              className="border-t border-border hover:bg-muted/30 transition"
            >
              {tab === "payout" ? (
                <>
                  <Td>{r.instructorName || "—"}</Td>
                  <Td right className="font-semibold text-foreground">
                    {money(r.amount)}
                  </Td>
                  <Td className="text-muted-foreground">
                    {r.transactionId || "—"}
                  </Td>
                  <Td right>
                    <button
                      className={`inline-flex items-center gap-2 text-sm ${canDownload(r) ? "text-foreground hover:text-primary" : "text-muted-foreground cursor-not-allowed"}`}
                      onClick={() => onDownload(r)}
                      type="button"
                      disabled={!canDownload(r)}
                    >
                      <Icon name="Download" size={16} />
                      Download
                    </button>
                  </Td>
                </>
              ) : tab === "revenue" ? (
                <>
                  <Td className="font-medium">{r.courseTitle || "—"}</Td>
                  <Td right className="font-semibold">
                    {money(r.amount)}
                  </Td>
                  <Td right className="text-muted-foreground">
                    {r.transactions ?? 0}
                  </Td>
                  <Td right>
                    <button
                      className={`inline-flex items-center gap-2 text-sm ${canDownload(r) ? "text-foreground hover:text-primary" : "text-muted-foreground cursor-not-allowed"}`}
                      onClick={() => onDownload(r)}
                      type="button"
                      disabled={!canDownload(r)}
                    >
                      <Icon name="Download" size={16} />
                      Download
                    </button>
                  </Td>
                </>
              ) : (
                <>
                  <Td className="font-medium">{r.courseTitle || "—"}</Td>
                  <Td right className="text-muted-foreground">
                    {r.enrollments ?? 0}
                  </Td>
                  {/* <Td right className="text-muted-foreground">
                    {r.rate || "—"}
                  </Td> */}
                  <Td right className="font-semibold">
                    {money(r.earned)}
                  </Td>
                  <Td right className="text-muted-foreground">
                    {fmtDate(r.date)}
                  </Td>
                  <Td right>
                    <button
                      className={`inline-flex items-center gap-2 text-sm ${canDownload(r) ? "text-foreground hover:text-primary" : "text-muted-foreground cursor-not-allowed"}`}
                      onClick={() => onDownload(r)}
                      type="button"
                      disabled={!canDownload(r)}
                    >
                      <Icon name="Download" size={16} />
                      Download
                    </button>
                  </Td>
                </>
              )}
            </tr>
          ))}

          {(rows || []).length === 0 ? (
            <tr>
              <td
                colSpan={tab === "commission" ? 6 : 4}
                className="p-10 text-center text-muted-foreground"
              >
                No data found
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
};

export default FinancialTable;

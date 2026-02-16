import React, { useMemo, useCallback, useState } from "react";
import Pagination from "components/ui/Pagination";
import Icon from "components/AppIcon";
import Image from "components/AppImage";
import Button from "components/ui/Button";

const StatusBadge = ({ status }) => {
  const s = String(status || "").toUpperCase();
  const cls =
    s === "PENDING"
      ? "bg-yellow-50 text-yellow-700 border-yellow-500"
      : s === "ACTIVE"
        ? "bg-green-50 text-green-700 border-green-500"
        : s === "INACTIVE"
          ? "bg-gray-100 text-gray-700 border-gray-400"
          : "bg-gray-100 text-gray-700 border-gray-400";

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${cls}`}
    >
      {s || "—"}
    </span>
  );
};

const formatDateTime = (d) => {
  if (!d) return "—";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "—";
  return (
    <>
      <div className="font-medium text-brand-gray-800">
        {dt.toLocaleDateString(undefined, {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })}
      </div>
      <div className="text-xs text-muted-foreground">
        {dt.toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
    </>
  );
};

const coerceInt = (v, fallback) => {
  const n = Number.parseInt(String(v ?? ""), 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

const KebabMenu = ({ onEdit }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative flex justify-end">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen((v) => !v)}
        iconName="MoreVertical"
      />
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-card border border-border rounded-lg shadow-elevation-3 z-50">
          <button
            className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-muted"
            onClick={() => {
              setOpen(false);
              onEdit?.();
            }}
          >
            <Icon name="Pencil" size={16} />
            Edit
          </button>
        </div>
      )}
    </div>
  );
};

const SchoolsTable = ({
  rows = [],
  pagination = null,
  onPageChange,
  onEdit,
}) => {
  const data = useMemo(() => rows || [], [rows]);

  const currentPage = pagination ? coerceInt(pagination.page, 1) : 1;
  const totalPages = pagination ? coerceInt(pagination.pages, 1) : 1;
  const totalItems = pagination
    ? coerceInt(pagination.total, data.length)
    : data.length;
  const pageSize = pagination ? coerceInt(pagination.limit, 10) : 10;

  const handlePageChange = useCallback(
    (nextPage) => {
      if (!pagination) return;
      if (typeof onPageChange !== "function") return;
      const safe = clamp(coerceInt(nextPage, currentPage), 1, totalPages);
      if (safe === currentPage) return;
      onPageChange(safe);
    },
    [pagination, onPageChange, currentPage, totalPages],
  );

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div>
          <h3 className="font-medium text-card-foreground">Schools</h3>
          <p className="text-sm text-muted-foreground">
            Manage and oversee schools across the platform
          </p>
        </div>
      </div>

      <div className="p-4">
        {data.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            No schools found.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs text-muted-foreground">
                    <th className="py-3 px-3">School</th>
                    <th className="py-3 px-3">Email</th>
                    <th className="py-3 px-3">Created</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {data.map((s) => {
                    const avatar = s?.profileImage?.url || "";
                    const schoolName = s?.profile?.schoolName || s?.name || "—";

                    return (
                      <tr
                        key={s._id}
                        className="border-t border-border text-sm"
                      >
                        <td className="py-4 px-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-muted border border-border">
                              {avatar ? (
                                <Image
                                  src={avatar}
                                  alt={schoolName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Icon
                                    name="School"
                                    size={18}
                                    className="text-muted-foreground"
                                  />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-brand-gray-800 truncate">
                                {schoolName}
                              </div>
                              <div className="text-xs text-muted-foreground truncate">
                                {s?.phone || "—"}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-3 text-brand-gray-800">
                          {s?.email || "—"}
                        </td>

                        <td className="py-4 px-3">
                          {formatDateTime(s?.createdAt)}
                        </td>

                        <td className="py-4 px-3">
                          <StatusBadge status={s?.status} />
                        </td>

                        <td className="py-4 px-3 text-right">
                          <KebabMenu onEdit={() => onEdit?.(s)} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {pagination && totalPages > 1 ? (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                isBorderTop={true}
                listType="schools"
              />
            ) : null}
          </>
        )}
      </div>
    </div>
  );
};

export default SchoolsTable;

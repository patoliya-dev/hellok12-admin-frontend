import React from "react";
import Icon from "../../../../components/AppIcon";
import Button from "../../../../components/ui/Button";
import LessonStatusBadge from "./LessonStatusBadge";

const LessonTable = ({ sessions, onSort, sortConfig, onShowModal }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (timeString) => {
    const time = new Date(`2000-01-01T${timeString}`);
    return time?.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getSortIcon = (column) => {
    if (sortConfig?.key !== column) {
      return (
        <Icon name="ArrowUpDown" size={14} className="text-muted-foreground" />
      );
    }
    return sortConfig?.direction === "asc" ? (
      <Icon name="ArrowUp" size={14} className="text-primary" />
    ) : (
      <Icon name="ArrowDown" size={14} className="text-primary" />
    );
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/30">
            <tr>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => onSort("date")}
                  className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-smooth"
                >
                  Date & Time
                  {getSortIcon("date")}
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => onSort("studentName")}
                  className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-smooth"
                >
                  Student
                  {getSortIcon("studentName")}
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="text-sm font-medium text-foreground">
                  Course Type
                </span>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => onSort("subject")}
                  className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-smooth"
                >
                  Subject
                  {getSortIcon("subject")}
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="text-sm font-medium text-foreground">
                  Duration
                </span>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => onSort("status")}
                  className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-smooth"
                >
                  Status
                  {getSortIcon("status")}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {sessions?.map((session) => (
              <tr
                key={session?.id}
                className="border-t border-border hover:bg-muted/30 transition-smooth"
              >
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-foreground">
                      {formatDate(session?.date)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {session?.time}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {session?.courseType !== "group" ? (
                    session?.students?.name ? (
                      <div>
                        <div className="font-medium text-foreground">
                          {session?.students.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {session?.students.age} years old
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">N/A</span>
                    )
                  ) : null}
                  {session?.courseType === "group" && (
                    <div>
                      <Button
                        variant="link"
                        size="sm"
                        className="!px-0 text-black"
                        onClick={() => onShowModal(session?.id)}
                      >
                        View All Student
                      </Button>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <LessonStatusBadge status={session?.courseType} />
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-foreground">
                      {session?.subject}
                    </div>
                    <div className="text-sm text-muted-foreground capitalize">
                      {session?.type}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-foreground">
                    {session?.duration} min
                  </span>
                </td>
                <td className="px-6 py-4">
                  <LessonStatusBadge status={session?.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Cards */}
      <div className="lg:hidden">
        {sessions?.map((session) => (
          <div
            key={session?.id}
            className="p-4 border-b border-border last:border-b-0"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <LessonStatusBadge status={session?.status} />
              </div>
              <span className="text-sm text-muted-foreground">
                {session?.duration} min
              </span>
            </div>

            <div className="mb-4">
              <LessonStatusBadge status={session?.courseType} />
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2">
                <Icon
                  name="Calendar"
                  size={16}
                  className="text-muted-foreground"
                />
                <span className="text-sm font-medium">
                  {formatDate(session?.date)} at {formatTime(session?.time)}
                </span>
              </div>
              {session?.courseType !== "Group" && (
                <div className="flex items-center gap-2">
                  <Icon
                    name="User"
                    size={16}
                    className="text-muted-foreground"
                  />
                  <span className="text-sm">
                    {session?.studentName} ({session?.studentAge} years old)
                  </span>
                </div>
              )}
              {session?.courseType === "Group" && (
                <div>
                  <Button
                    variant="link"
                    size="sm"
                    className="!px-0 text-black"
                    onClick={() => onShowModal(session?.id)}
                  >
                    View All Student
                  </Button>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Icon
                  name="BookOpen"
                  size={16}
                  className="text-muted-foreground"
                />
                <span className="text-sm">
                  {session?.subject} • {session?.type}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Empty State */}
      {sessions?.length === 0 && (
        <div className="p-12 text-center">
          <Icon
            name="Calendar"
            size={48}
            className="text-muted-foreground mx-auto mb-4"
          />
          <h3 className="text-lg font-medium text-foreground mb-2">
            No sessions found
          </h3>
          <p className="text-muted-foreground">
            Try adjusting your filters to see more sessions.
          </p>
        </div>
      )}
    </div>
  );
};

export default LessonTable;

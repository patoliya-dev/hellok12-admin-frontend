import { useMemo, useState } from "react";
import Icon from "components/AppIcon";
import Modal from "components/ui/Modal";

const GroupedStudents = ({ students, onClose }) => {
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig?.key === key && prevConfig?.direction === "asc"
          ? "desc"
          : "asc",
    }));
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

  const filteredAndSortedSessions = useMemo(() => {
    // Sort sessions
    students?.sort((a, b) => {
      let aValue = a?.[sortConfig?.key];
      let bValue = b?.[sortConfig?.key];

      if (aValue < bValue) {
        return sortConfig?.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig?.direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    return students;
  }, [sortConfig]);

  return (
    <Modal title="Student Group" onClose={onClose}>
      <div className="overflow-hidden">
        {/* Desktop Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-fixed border-collapse">
            <colgroup>
              <col style={{ width: "33.33%" }} />
              <col style={{ width: "33.33%" }} />
              <col style={{ width: "33.34%" }} />
            </colgroup>
            <thead className="bg-muted/30">
              <tr>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort("name")}
                    className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-smooth"
                  >
                    Student
                    {getSortIcon("name")}
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort("age")}
                    className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-smooth"
                  >
                    Student Age
                    {getSortIcon("age")}
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort("status")}
                    className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-smooth"
                  >
                    Status
                    {getSortIcon("status")}
                  </button>
                </th>
              </tr>
            </thead>
          </table>

          {/* scrollable body wrapper */}
          <div className="max-h-72 overflow-y-auto">
            <table className="w-full table-fixed border-collapse">
              <colgroup>
                <col style={{ width: "33.33%" }} />
                <col style={{ width: "33.33%" }} />
                <col style={{ width: "33.34%" }} />
              </colgroup>
              <tbody>
                {filteredAndSortedSessions?.map((stud) => (
                  <tr
                    key={stud?.id}
                    className="border-t border-border hover:bg-muted/30 transition-smooth"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">
                        {stud?.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">
                        {stud?.age ? `${stud?.age} years old` : "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground capitalize">
                        {stud?.status}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Empty State */}
        {students?.length === 0 && (
          <div className="p-12 text-center">
            <Icon
              name="Calendar"
              size={48}
              className="text-muted-foreground mx-auto mb-4"
            />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No Students found
            </h3>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default GroupedStudents;

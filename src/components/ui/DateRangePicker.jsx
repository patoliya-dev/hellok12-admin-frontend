// components/DateRangePicker.jsx
import React, { useEffect, useState } from "react";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import "react-date-range/dist/styles.css"; // main style
import "react-date-range/dist/theme/default.css"; // theme css
import Icon from "components/AppIcon";

const DateRangePicker = ({
  onChange,
  onClear = false,
  className = "",
  buttonClassName = "",
  textClassName = "",
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [tempRange, setTempRange] = useState(range);

  const handleSelect = (ranges) => {
    setTempRange([ranges.selection]);
  };

  const handleDone = () => {
    setRange(tempRange);
    onChange?.(tempRange[0]);
    setShowPicker(false);
  };

  const handleTogglePicker = () => {
    if (!showPicker) {
      // When opening, sync tempRange with current range
      setTempRange(range);
    }
    setShowPicker(!showPicker);
  };

  useEffect(() => {
    (() => {
      if (onClear) {
        const defaultRange = [
          {
            startDate: new Date(),
            endDate: new Date(),
            key: "selection",
          },
        ];
        setRange(defaultRange);
        setTempRange(defaultRange);
      }
    })();
  }, [onClear]);

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Display input box */}
      <button
        type="button"
        onClick={handleTogglePicker}
        className={`w-full h-10 flex items-center gap-2 border border-border bg-background rounded-md px-4 transition-colors hover:bg-muted/30 ${buttonClassName}`}
      >
        <Icon name="Calendar" size={16} className="text-muted-foreground" />
        <span
          className={`font-medium text-sm text-foreground ${textClassName}`}
        >
          {format(range[0].startDate, "MMM dd, yyyy")} -{" "}
          {format(range[0].endDate, "MMM dd, yyyy")}
        </span>
      </button>

      {/* Dropdown Calendar */}
      {showPicker && (
        <div className="absolute mt-2 z-50 bg-white border rounded-lg shadow-lg">
          <DateRange
            ranges={tempRange}
            onChange={handleSelect}
            moveRangeOnFirstSelection={false}
            editableDateInputs={true}
          />
          <div className="flex justify-end p-2">
            <button
              onClick={handleDone}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;

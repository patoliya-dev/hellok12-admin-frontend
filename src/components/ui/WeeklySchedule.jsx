import React, { useEffect, useState } from "react";
import Input from "./Input";
import { useDispatch, useSelector } from "react-redux";
import { fetchSlotsForDate } from "reducers/schedule/scheduleThunks";
import { normalizeTime12h } from "../../utils/time12h";
// import { normalizeToHHMM24 } from "../../utils/time24h";

const FieldError = ({ children }) =>
  children ? <p className="mt-1 text-sm text-destructive">{children}</p> : null;

export default function WeeklySchedule({
  formData,
  // handleInputChange,
  errors = {},
  teacherId: externalTeacherId, // Optional: override the auth user's teacherId
  // onTeacherRequired, // Optional: callback when teacher is required but not provided
  disabled = false,
}) {
  const dispatch = useDispatch();
  const auth = useSelector((s) => s.auth);
  // Use external teacherId if provided, otherwise fall back to auth user's ID
  const teacherId = externalTeacherId || auth?.user?._id || auth?.user?.id;

  const [availableSlots, setAvailableSlots] = useState([]); // array of { label, minutes, disabled? } OR legacy string[]
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedTime, setSelectedTime] = useState(
    formData?.schedule?.time || "",
  );

  // fetch slots whenever date changes
  useEffect(() => {
    (() => {
      const date = formData?.schedule?.date;
      if (!date || !teacherId) {
        setAvailableSlots([]);
        setSelectedTime(formData?.schedule?.time || "");
        return;
      }

      let mounted = true;
      setLoadingSlots(true);

      dispatch(fetchSlotsForDate({ teacherId, date }))
        .unwrap()
        .then((res) => {
          // Thunk may return different shapes; support both:
          // 1) array of items (new) OR 2) { slots: [...] } / ['09:00', ...]
          let items = [];

          if (Array.isArray(res)) {
            // some thunks might return array directly
            items = res;
          } else if (res?.slots && Array.isArray(res.slots)) {
            items = res.slots;
          } else if (res?.data && Array.isArray(res.data)) {
            items = res.data;
          } else if (res?.data?.slots && Array.isArray(res.data.slots)) {
            items = res.data.slots;
          }

          // normalize: convert legacy strings into objects { label, minutes, disabled }
          const normalized = items
            .map((it) => {
              if (typeof it === "string") {
                // assume HH:MM string (24h)
                const [h, m] = it.split(":").map(Number);
                const minutes = h * 60 + (m || 0);
                return { label: it, minutes, disabled: false };
              }
              // If item already has label/minutes, respect it.
              // If only label in 12h format exists, we still use it unchanged.
              if (it && typeof it === "object" && it.label) {
                // ensure minutes exist
                if (
                  !("minutes" in it) &&
                  typeof it.label === "string" &&
                  /^\d{2}:\d{2}$/.test(it.label)
                ) {
                  const [h, m] = it.label.split(":").map(Number);
                  return { ...it, minutes: h * 60 + (m || 0) };
                }
                return it;
              }
              return null;
            })
            .filter(Boolean);

          if (!mounted) return;
          setAvailableSlots(normalized);
        })
        .catch(() => {
          if (!mounted) return;
          setAvailableSlots([]);
        })
        .finally(() => {
          if (!mounted) return;
          setLoadingSlots(false);
        });
      return () => {
        mounted = false;
      };
    })();
  }, [formData?.schedule?.date, teacherId, dispatch]);

  useEffect(() => {
    (() => {
      setSelectedTime(formData?.schedule?.time || "");
    })();
  }, [formData?.schedule?.time]);

  // const onTimeClick = (slot) => {
  //   // slot may be string (legacy) or object { label, disabled }
  //   const rawLabel = typeof slot === "string" ? slot : slot.label;
  //   const disabled = typeof slot === "string" ? false : !!slot.disabled;
  //   if (disabled) return;
  //   // Always store 24h "HH:MM" in formData.schedule.time
  //   const hhmm24 = normalizeToHHMM24(rawLabel) || rawLabel;

  //   // handleInputChange("schedule.time", hhmm24);
  //   setSelectedTime(hhmm24);
  // };

  return (
    <div className="w-full my-6">
      <h3 className="text-sm font-medium text-brand-gray-800 mb-2">
        Schedule <span className="text-error">*</span>
      </h3>

      <div className="flex flex-col sm:flex-row sm:items-center border border-border rounded-lg px-4 py-3 shadow-sm bg-white gap-y-4 sm:gap-y-0">
        {/* Date Picker using your Input */}
        <div className="flex items-center border-r pr-4">
          <Input
            type="date"
            value={formData?.schedule?.date || ""}
            required
            // onChange={(e) => {
            //   const newDate = e.target.value;
            //   // If onTeacherRequired is provided and no teacherId, call the callback
            //   if (onTeacherRequired && !teacherId && newDate) {
            //     onTeacherRequired();
            //     return;
            //   }
            //   // handleInputChange("schedule.date", newDate);
            // }}
            className=""
            error={errors.date}
            disabled={disabled}
          />
        </div>

        {/* Time Buttons */}
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-2 sm:px-4">
            {loadingSlots ? (
              <div className="text-sm text-muted-foreground px-4 py-2">
                Loading slots…
              </div>
            ) : (
              <>
                {availableSlots.length > 0 ? (
                  availableSlots.map((slotItem) => {
                    const label =
                      typeof slotItem === "string" ? slotItem : slotItem.label;
                    // const disabled =
                    //   typeof slotItem === "string"
                    //     ? false
                    //     : !!slotItem.disabled;
                    const displayLabel = /^\d{2}:\d{2}$/.test(label)
                      ? normalizeTime12h(label)
                      : label;
                    return (
                      <button
                        key={label}
                        disabled={disabled}
                        // onClick={() => onTimeClick(slotItem)}
                        className={`px-4 py-1.5 text-sm rounded-md border transition
                          ${
                            selectedTime === label ||
                            formData?.schedule?.time == label
                              ? "bg-blue-600 text-white border-blue-600"
                              : disabled
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
                          }`}
                      >
                        {displayLabel}
                      </button>
                    );
                  })
                ) : (
                  <div className="text-sm text-muted-foreground px-4">
                    No slots available for selected date
                  </div>
                )}
              </>
            )}
          </div>
          <div className="ps-4">
            <FieldError>{errors.time}</FieldError>
          </div>
        </div>
      </div>
    </div>
  );
}

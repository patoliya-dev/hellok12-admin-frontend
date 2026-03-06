import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../../../components/AppIcon";
import Image from "../../../../components/AppImage";
import Button from "../../../../components/ui/Button";
import LessonDetailsModal from "./LessonDetailsModal";
import { TAG_CONFIG } from "../data";
// import { schoolService } from "../../../../services/school/school.service";
import Loader from "../../../../components/ui/Loader";
import {
  getUserTimezone,
  formatTimeToTZ,
  formatDateToTZ,
} from "../../../../utils/timezone";

// ---- helpers ----
// const toDate = (v) => {
//   if (!v) return null;

//   // If backend returns Date-like strings, keep them as-is.
//   // DO NOT remove 'Z' and DO NOT "manually" shift timezone.
//   const d = v instanceof Date ? v : new Date(v);
//   return Number.isNaN(d.getTime()) ? null : d;
// };

// const computeStatus = ({ start, end, rawStatus }) => {
//   const s = String(rawStatus || "").toLowerCase();

//   const startDt = toDate(start);
//   const endDt = toDate(end);

//   const now = Date.now();
//   const startMs = startDt?.getTime();
//   const endMs = endDt?.getTime();

//   if (startMs && endMs) {
//     if (now >= endMs) return "completed";
//     if (now >= startMs && now < endMs) return "in-progress";

//     const minutesUntil = Math.floor((startMs - now) / (1000 * 60));
//     if (minutesUntil > 0 && minutesUntil <= 15) return "starting-soon";
//     return "scheduled";
//   }

//   if (s.includes("cancel")) return "cancelled";
//   if (s.includes("complete")) return "completed";
//   if (s.includes("progress")) return "in-progress";
//   if (s.includes("soon")) return "starting-soon";
//   return s || "scheduled";
// };

// const formatAddressOneLine = (address) => {
//   if (!address) return "";
//   if (typeof address === "string") return address;

//   const parts = [
//     address.line1,
//     address.line2,
//     address.area,
//     address.city,
//     address.state,
//     address.postalCode,
//     address.country,
//   ]
//     .map((x) => String(x || "").trim())
//     .filter(Boolean);

//   return parts.join(", ");
// };

const getLessonTags = (tag) => {
  const badge = TAG_CONFIG[tag];
  if (!badge) return null;

  const { text, icon, image, color } = badge;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${color}`}
    >
      {icon ? (
        <Icon name={icon} size={12} className="mr-1" />
      ) : (
        image && <Image src={image} alt={text} className="mr-1 w-4 h-4" />
      )}
      {text}
    </span>
  );
};

const UpcomingLessonCard = () => {
  const [upcomingLessons] = useState([]); // setUpcomingLessons
  const [loading] = useState(true); // setLoading
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const [selectedLesson, setSelectedLesson] = useState(null);

  const navigate = useNavigate();

  const userTimeZone = useMemo(() => getUserTimezone(), []);

  // Update current time every minute (for countdown label)
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // const transform = useCallback((session) => {
  //   // Prefer session.start/end (SessionModel). Fallback to lesson fields if needed.
  //   const startIso =
  //     session?.start || session?.startAt || session?.lesson?.startAt;
  //   const endIso = session?.end || session?.endAt || session?.lesson?.endAt;

  //   const startDt = toDate(startIso);
  //   const endDt = toDate(endIso);

  //   const course = session?.course || {};
  //   const lesson = session?.lesson || {};
  //   const teacher = session?.teacher || lesson?.teacherId || {};

  //   const mode = course?.mode || "online";
  //   const lessonType = course?.lessonType || "1-on-1";

  //   const address =
  //     mode === "in-person"
  //       ? formatAddressOneLine(
  //           course?.address || lesson?.address || session?.address || null,
  //         )
  //       : "";

  //   const status = computeStatus({
  //     start: startDt,
  //     end: endDt,
  //     rawStatus: session?.status || lesson?.status,
  //   });

  //   // duration: prefer computed if start/end exists
  //   const duration =
  //     lesson?.schedule?.duration ||
  //     (startDt && endDt
  //       ? Math.max(0, Math.round((endDt - startDt) / 60000))
  //       : 60);

  //   return {
  //     id: session?._id || session?.id,
  //     subject: course?.title || lesson?.title || "Lesson",
  //     title: lesson?.title || course?.title || "Lesson",
  //     description: lesson?.description || course?.description || "",
  //     status,

  //     // Keep raw UTC instants (string/Date) for formatting in a specific TZ
  //     startTimeIso: startIso,
  //     endTimeIso: endIso,

  //     // Keep Date objects for comparisons (epoch-based; timezone-safe)
  //     startTime: startDt,
  //     endTime: endDt,

  //     duration,
  //     lessonMode: mode,
  //     lessonType,
  //     address: address || null,

  //     isTrailAvailable: Boolean(
  //       lesson?.isTrialAvailable || course?.isTrialAvailable,
  //     ),
  //     isCurriculumGames: Boolean(course?.isCurriculumGames),

  //     teacher: {
  //       name: teacher?.name || "Teacher",
  //       avatar:
  //         teacher?.profileImage?.url ||
  //         teacher?.profileImageRef?.url ||
  //         course?.introImageRef?.url ||
  //         "",
  //     },

  //     joinUrl: session?.joinUrl || session?.meetingUrl || "",
  //     courseId: course?._id || "",
  //     createdAt: session?.createdAt ? new Date(session.createdAt) : new Date(),
  //   };
  // }, []);

  // const fetchUpcomingLessons = useCallback(async () => {
  //   const ctrl = new AbortController();
  //   setLoading(true);

  //   try {
  //     const res = await schoolService.getUpcomingLessons({
  //       limit: 10,
  //       days: 7,
  //       signal: ctrl.signal,
  //     });

  //     const lessonsRaw = res?.lessons || [];
  //     const normalized = Array.isArray(lessonsRaw)
  //       ? lessonsRaw.map(transform)
  //       : [];

  //     // Filter out invalid dates defensively
  //     setUpcomingLessons(normalized.filter((x) => x.startTime));
  //   } catch (error) {
  //     if (error?.name !== "CanceledError" && error?.name !== "AbortError") {
  //       console.error("Failed to fetch upcoming lessons:", error);
  //     }
  //     setUpcomingLessons([]);
  //   } finally {
  //     setLoading(false);
  //   }

  //   return () => ctrl.abort();
  // }, [transform]);

  // useEffect(() => {
  //   fetchUpcomingLessons();
  // }, [fetchUpcomingLessons]);

  const getTimeUntilSession = useCallback(
    (lesson) => {
      const start = lesson?.startTime;
      if (!start) return "—";

      const diff = start.getTime() - currentTime.getTime();
      const minutes = Math.floor(diff / (1000 * 60));
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      // If it's on a later date, show the DATE in the user's TZ (not browser default)
      if (days > 0) {
        // use ISO if available; else fallback to Date instance
        const iso = lesson?.startTimeIso || start.toISOString();
        return formatDateToTZ(iso, userTimeZone, {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }

      if (hours > 0) return `${hours}h ${minutes % 60}m`;
      if (minutes > 0) return `Start in ${minutes}m`;
      return "Starting now";
    },
    [currentTime, userTimeZone],
  );

  const handleViewSchedule = useCallback(() => {
    navigate("/school/lessons");
  }, [navigate]);

  const handleLessonClick = useCallback((lesson) => {
    setSelectedLesson(lesson);
  }, []);

  const emptyState = useMemo(
    () => (
      <div className="py-8 flex flex-col items-center">
        <Icon name="Calendar" size={48} color="var(--color-muted-foreground)" />
        <p className="text-muted-foreground mt-4">No upcoming lessons</p>
      </div>
    ),
    [],
  );

  const canJoin = (lesson) => {
    // Only online lessons with joinUrl; allow join if starting-soon OR in-progress
    if (!lesson?.joinUrl) return false;
    if (lesson.lessonMode !== "online") return false;
    return lesson.status === "starting-soon" || lesson.status === "in-progress";
  };

  const handleJoin = (lesson) => {
    if (lesson?.joinUrl) window.open(lesson.joinUrl, "_blank");
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="CalendarClock" size={24} color="var(--color-primary)" />
          <h2 className="text-xl font-semibold text-foreground">
            Upcoming Lessons
          </h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          iconName="Calendar"
          iconPosition="left"
          iconSize={16}
          onClick={handleViewSchedule}
        >
          View All
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader />
        </div>
      ) : upcomingLessons.length === 0 ? (
        emptyState
      ) : (
        <div className="space-y-4">
          {upcomingLessons.slice(0, 4).map((lesson) => {
            const startIso =
              lesson.startTimeIso || lesson.startTime?.toISOString();
            const endIso = lesson.endTimeIso || lesson.endTime?.toISOString();

            return (
              <div
                key={lesson.id}
                className={`p-4 rounded-lg border transition-micro ${
                  lesson.status === "starting-soon"
                    ? "border-warning bg-warning/5"
                    : "border-border bg-muted/30"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2 sm:gap-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-muted">
                      <Image
                        src={lesson.teacher.avatar || ""}
                        alt={lesson.teacher.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">
                        {lesson.teacher.name}
                      </h3>
                    </div>
                  </div>

                  <div className="sm:text-right">
                    <div
                      className={`text-sm font-medium ${
                        lesson.status === "starting-soon"
                          ? "text-warning"
                          : "text-primary"
                      }`}
                    >
                      {getTimeUntilSession(lesson)}
                    </div>
                    <div className="text-xs text-brand-gray-500">
                      {lesson.duration} minutes
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-1 mb-2 gap-2 sm:gap-0">
                  <div className="flex items-center space-x-1">
                    <Icon
                      name="Clock"
                      size={14}
                      color="var(--color-muted-foreground)"
                    />
                    <span className="text-sm text-brand-gray-500">
                      {startIso ? formatTimeToTZ(startIso, userTimeZone) : "—"}{" "}
                      - {endIso ? formatTimeToTZ(endIso, userTimeZone) : "—"}
                    </span>
                  </div>

                  {lesson.lessonMode === "in-person" && (
                    <div className="sm:pl-4">
                      {getLessonTags(lesson.lessonType)}
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
                  <div className="flex items-center space-x-2 sm:space-x-4 flex-wrap">
                    {lesson.lessonMode === "in-person" ? (
                      <div className="flex items-center space-x-1">
                        <Icon name="MapPin" size={14} />
                        <span className="text-sm text-brand-gray-800">
                          {lesson.address || "—"}
                        </span>
                      </div>
                    ) : (
                      <>
                        {getLessonTags(lesson.lessonType)}
                        {getLessonTags(lesson.lessonMode)}
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {canJoin(lesson) && (
                      <Button
                        variant="default"
                        size="sm"
                        iconName="Video"
                        iconPosition="left"
                        iconSize={16}
                        onClick={() => handleJoin(lesson)}
                      >
                        Join
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="ReceiptText"
                      iconPosition="left"
                      iconSize={16}
                      onClick={() => handleLessonClick(lesson)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Session Detail Modal */}
      {selectedLesson && (
        <LessonDetailsModal
          lesson={selectedLesson}
          onClose={() => setSelectedLesson(null)}
          getLessonTags={getLessonTags}
          userTimeZone={userTimeZone}
        />
      )}
    </div>
  );
};

export default UpcomingLessonCard;

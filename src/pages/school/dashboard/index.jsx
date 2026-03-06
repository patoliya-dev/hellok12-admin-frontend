import RoleBasedHeader from "../../../components/ui/RoleBasedHeader";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Card from "./components/Card";
import UpcomingLessonCard from "./components/UpcomingLessonCard";
import QuickAction from "./components/QuickAction";
import PageHeader from "../../../components/ui/PageHeader";
import InviteTeacherModal from "../manage-teachers/components/InviteTeacherModal";
// import { useNavigate } from "react-router-dom";
import Loader from "../../../components/ui/Loader";
import { errorToast } from "../../../utils/utils";

// import { getDashboardData } from "../../../services/lessons/lesson.service";
// import { schoolDashboardService } from "../../../services/dashboard/schoolDashboard.service";
import { buildSchoolCardData } from "./data";

const SchoolDashboard = () => {
  // const navigate = useNavigate();
  const [showInviteModal, setShowInviteModal] = useState(false);
  // const [todaySessions, setTodaySessions] = useState([]);
  const [cards] = useState(() => buildSchoolCardData({})); // setCards

  const [loading, setLoading] = useState(true);
  const [metricsLoading, setMetricsLoading] = useState(true);
  // const [scheduleError, setScheduleError] = useState(null);

  const handleInviteModalOpen = useCallback(() => {
    setShowInviteModal((v) => !v);
  }, []);

  // const handleJoinSession = useCallback((session) => {
  //   if (session?.joinUrl) window.open(session.joinUrl, "_blank");
  // }, []);

  // const handleCancelSession = useCallback(() => {
  //   // keep current behavior; replace later if you add cancel endpoint
  //   alert("Session canceled successfully!");
  // }, []);

  // const handleViewAllSchedules = useCallback(() => {
  //   navigate("/school/lessons");
  // }, [navigate]);

  // const handleMessages = useCallback(() => {
  //   navigate("/school/messages");
  // }, [navigate]);

  const refreshAll = useCallback(async () => {
    const ctrl = new AbortController();
    setLoading(true);
    setMetricsLoading(true);
    // setScheduleError(null);

    try {
      // const [metricsRes] = await Promise.all([
      //   schoolDashboardService.getMetrics({ signal: ctrl.signal }),
      //   getDashboardData({ signal: ctrl.signal }), // role-aware BE response
      // ]);
      // // header cards
      // setCards(buildSchoolCardData(metricsRes?.data || {}));
      // today sessions (align to TodaySchedule expected shape)
      // const sessionsRaw =
      //   dashRes?.data?.lessons || dashRes?.data?.data?.lessons || [];
      // const normalized = (sessionsRaw || []).map((s) => ({
      //   ...s,
      //   // Teacher dashboard uses startTime = lesson.startAt
      //   startTime: s?.lesson?.startAt || s?.startTime || s?.start || s?.startAt,
      //   endTime: s?.lesson?.endAt || s?.endTime || s?.end || s?.endAt,
      // }));
      // setTodaySessions(normalized);
    } catch (e) {
      console.error(e);
      // setScheduleError(e?.message || "Failed to load dashboard");
      errorToast(e?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
      setMetricsLoading(false);
    }

    return () => ctrl.abort();
  }, []);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const pageHeaderButtonTitle = useMemo(
    () => (loading ? "Refreshing..." : "Refresh"),
    [loading],
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <RoleBasedHeader />

      {/* Main Content */}
      {loading ? (
        <Loader />
      ) : (
        <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pb-8">
          <PageHeader
            title="Dashboard Overview"
            description={
              "Welcome back! Here's what's happening at your school today."
            }
            isButton
            iconName="RefreshCw"
            buttonTitle={pageHeaderButtonTitle}
            onButtonClick={refreshAll}
          />
          <section className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {metricsLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-card border border-border rounded-lg p-6 animate-pulse"
                    >
                      <div className="h-4 bg-muted rounded w-24 mb-3" />
                      <div className="h-8 bg-muted rounded w-16" />
                    </div>
                  ))
                : cards.map((card, idx) => <Card key={idx} cardData={card} />)}
            </div>
          </section>

          {/* Desktop View */}
          {/* <section className="mb-8 hidden lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-8 space-y-8">
              {scheduleError ? (
                <div className="bg-card rounded-lg border border-destructive/50 p-8 text-center">
                  <p className="text-destructive mb-2">
                    Failed to load schedule
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {scheduleError}
                  </p>
                </div>
              ) : (
                <div className="lg:col-span-8 space-y-8">
                  {/* Upcoming Sessions */}
          {/* <UpcomingLessonCard />
                </div>
              )}
            </div> */}
          {/* Right Column */}
          {/* <div className="lg:col-span-4 space-y-8">
              <QuickAction onInviteTeacher={handleInviteModalOpen} />
            </div>
          </section> */}

          {/* Mobile View */}
          <section className="lg:hidden space-y-6">
            {/* Upcoming Lessons */}
            <UpcomingLessonCard />
            {/* Quick Actions */}
            <QuickAction onInviteTeacher={handleInviteModalOpen} />
          </section>
        </main>
      )}

      <InviteTeacherModal
        isOpen={showInviteModal}
        onClose={handleInviteModalOpen}
      />
    </div>
  );
};

export default SchoolDashboard;

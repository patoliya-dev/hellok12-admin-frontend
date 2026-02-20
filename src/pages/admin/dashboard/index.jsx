import React, { useEffect, useMemo, useState } from "react";

import Loader from "components/ui/Loader";
import RoleBasedHeader from "components/ui/RoleBasedHeader";
import { adminDashboardService } from "../../../services/dashboard/adminDashboard.service";
import { errorToast } from "../../../utils/utils";

import LineGrowthCard from "./components/LineGrowthCard";
import QuickActionsCard from "./components/QuickActionsCard";
import StatCard from "./components/StatCard";
import StudentRegistrationCard from "./components/StudentRegistrationCard";
import { CARD_CONFIG, QUICK_ACTIONS, defaultOverview } from "./components/dashboardConfig";

const LINE_COLORS = {
  schoolTeachers: "#1D4ED8",
  independentTeachers: "#6366F1",
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(defaultOverview);

  useEffect(() => {
    let isMounted = true;
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const data = await adminDashboardService.getOverview({ months: 9 });
        if (!isMounted) return;
        setOverview({
          cards: { ...defaultOverview.cards, ...(data?.cards || {}) },
          charts: {
            schoolTeachersGrowth: data?.charts?.schoolTeachersGrowth || [],
            independentTeachersGrowth: data?.charts?.independentTeachersGrowth || [],
            studentRegistrationGrowth: data?.charts?.studentRegistrationGrowth || [],
          },
          trends: {
            studentRegistration: {
              ...defaultOverview.trends.studentRegistration,
              ...(data?.trends?.studentRegistration || {}),
            },
          },
        });
      } catch (e) {
        if (isMounted) {
          errorToast(e?.message || "Failed to load dashboard overview");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDashboard();
    return () => {
      isMounted = false;
    };
  }, []);

  const cards = useMemo(
    () =>
      CARD_CONFIG.map((cfg) => ({
        ...cfg,
        value: overview?.cards?.[cfg.key] || 0,
      })),
    [overview?.cards],
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <RoleBasedHeader />
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <RoleBasedHeader />

      <main className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pb-8">
        <section className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card) => (
            <StatCard
              key={card.key}
              icon={card.icon}
              iconBg={card.iconBg}
              title={card.title}
              value={card.value}
            />
          ))}
        </section>

        <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          <LineGrowthCard
            title="School Teachers Growth"
            data={overview?.charts?.schoolTeachersGrowth || []}
            lineColor={LINE_COLORS.schoolTeachers}
          />
          <LineGrowthCard
            title="Independent Teachers Growth"
            data={overview?.charts?.independentTeachersGrowth || []}
            lineColor={LINE_COLORS.independentTeachers}
          />
        </section>

        <section className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-8">
            <StudentRegistrationCard
              data={overview?.charts?.studentRegistrationGrowth || []}
              trend={overview?.trends?.studentRegistration}
            />
          </div>
          <div className="lg:col-span-4">
            <QuickActionsCard actions={QUICK_ACTIONS} />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;

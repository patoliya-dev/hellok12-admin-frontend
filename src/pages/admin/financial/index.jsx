import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import RoleBasedHeader from "components/ui/RoleBasedHeader";
import Icon from "components/AppIcon";
import Pagination from "components/ui/Pagination";
import DateRangePicker from "components/ui/DateRangePicker";

import {
  getFinancialSummary,
  getFinancialTrend,
  getPayouts,
  getRevenue,
  getCommission,
} from "reducers/financial/financialThunks";

import {
  selectFinancialReq,
  selectFinancialSummaryByPeriod,
  selectFinancialTrend,
  selectPayout,
  selectRevenue,
  selectCommission,
} from "reducers/financial/financialSlice";
import {
  fetchFinancialCommissionReport,
  fetchFinancialRevenueReport,
} from "../../../services/financial/financial.service";

import FinancialChart from "./components/FinancialChart";
import FinancialTopCards from "./components/FinancialTopCards";
import FinancialTable from "./components/FinancialTable";

const TABS = [
  { key: "commission", label: "Commission" },
  { key: "revenue", label: "Revenue" },
  { key: "payout", label: "Payout" },
];

const PERIODS = [
  { key: "weekly", label: "Weekly" },
  { key: "monthly", label: "Monthly" },
  { key: "yearly", label: "Yearly" },
];
const TABLE_LIMIT = 8;

const normalizeDateParam = (value) => {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0",
  )}-${String(date.getDate()).padStart(2, "0")}`;
};

const toSafeFileName = (name, fallback) =>
  String(name || fallback)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || fallback;

const Financial = () => {
  const dispatch = useDispatch();

  const [period, setPeriod] = useState("weekly");
  const summary = useSelector(selectFinancialSummaryByPeriod(period));
  const trend = useSelector(selectFinancialTrend);

  const payout = useSelector(selectPayout);
  const revenue = useSelector(selectRevenue);
  const commission = useSelector(selectCommission);

  const trendReq = useSelector(selectFinancialReq("trend"));
  const summaryReq = useSelector(selectFinancialReq("summary"));

  const [activeTab, setActiveTab] = useState("commission");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "desc",
  });

  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });

  // Summary is period-dependent only; avoid re-fetching when tab changes.
  useEffect(() => {
    if (summary) return;
    dispatch(getFinancialSummary({ period }));
  }, [dispatch, period, summary]);

  useEffect(() => {
    dispatch(getFinancialTrend({ tab: activeTab, period }));
  }, [dispatch, activeTab, period]);

  const tableState =
    activeTab === "payout"
      ? payout
      : activeTab === "revenue"
        ? revenue
        : commission;

  const placeholder = useMemo(() => {
    if (activeTab === "payout") return "Search schools & teachers name";
    return "Search courses name";
  }, [activeTab]);

  const downloadReport = useCallback(async ({ response, fileName }) => {
    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }, []);

  const handleRevenueDownload = useCallback(async (row) => {
    if (!row?.courseId) return;
    try {
      const params = {};
      const response = await fetchFinancialRevenueReport(row.courseId, params);
      await downloadReport({
        response,
        fileName: `${toSafeFileName(row.courseTitle, "revenue-report")}.pdf`,
      });
    } catch (error) {
      console.error("Failed to download revenue report", error);
    }
  }, [downloadReport]);

  const handleCommissionDownload = useCallback(
    async (row) => {
      if (!row?.courseId) return;
      try {
        const params = {};
        if (dateRange?.startDate) params.startDate = dateRange.startDate;
        if (dateRange?.endDate) params.endDate = dateRange.endDate;

        const response = await fetchFinancialCommissionReport(
          row.courseId,
          params,
        );
        await downloadReport({
          response,
          fileName: `${toSafeFileName(row.courseTitle, "commission-report")}.pdf`,
        });
      } catch (error) {
        console.error("Failed to download commission report", error);
      }
    },
    [dateRange, downloadReport],
  );

  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      setDebouncedSearch(search.trim());
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    const params = {
      page,
      limit: TABLE_LIMIT,
      search: debouncedSearch,
    };

    if (sortConfig?.key) {
      params.sortBy = sortConfig.key;
      params.sortOrder = sortConfig.direction || "desc";
    }

    // Commission tab uses date range picker in UI
    if (
      activeTab === "commission" &&
      dateRange?.startDate &&
      dateRange?.endDate
    ) {
      params.startDate = dateRange.startDate;
      params.endDate = dateRange.endDate;
    }

    if (activeTab === "payout") dispatch(getPayouts(params));
    else if (activeTab === "revenue") dispatch(getRevenue(params));
    else dispatch(getCommission(params));
  }, [
    activeTab,
    dateRange?.endDate,
    dateRange?.startDate,
    debouncedSearch,
    dispatch,
    page,
    sortConfig,
  ]);

  return (
    <div className="min-h-screen bg-background">
      <RoleBasedHeader />

      <main className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pb-8">
        {/* Top cards */}
        <FinancialTopCards
          summary={summary}
          loading={summaryReq?.status === "loading" && !summary}
        />

        {/* Tabs */}
        <div className="mt-6 border-b border-border">
          <div className="flex gap-8 text-sm">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => {
                  setActiveTab(t.key);
                  setPage(1);
                  setSearch("");
                  setDebouncedSearch("");
                  setSortConfig({ key: null, direction: "desc" });
                  setDateRange({ startDate: "", endDate: "" });
                }}
                className={[
                  "pb-3 relative",
                  activeTab === t.key
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                ].join(" ")}
              >
                {t.label}
                {activeTab === t.key ? (
                  <span className="absolute left-0 -bottom-[1px] h-[2px] w-full bg-primary rounded-full" />
                ) : null}
              </button>
            ))}
          </div>
        </div>

        {/* Chart + Period */}
        <section className="mt-6 bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground capitalize">
              {activeTab}
            </h3>

            <div className="bg-muted rounded-lg p-1 inline-flex">
              {PERIODS.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setPeriod(p.key)}
                  className={[
                    "px-4 py-2 rounded-md text-sm font-medium transition",
                    period === p.key
                      ? "bg-primary text-primary-foreground shadow-card"
                      : "text-muted-foreground hover:text-foreground hover:bg-background",
                  ].join(" ")}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 h-[320px]">
            <FinancialChart
              loading={trendReq?.status === "loading"}
              data={(trend?.dataPoints || []).map((x) => ({
                period: x.label,
                value: x.amount,
              }))}
            />
          </div>
        </section>

        {/* Search + Table */}
        <section className="mt-6 bg-card border border-border rounded-xl">
          <div className="p-5 flex items-center justify-between gap-4">
            <div className="h-10 flex items-center gap-3 w-full max-w-[740px] bg-background border border-border rounded-md px-4">
              <Icon
                name="Search"
                size={17}
                className="text-muted-foreground/90"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={placeholder}
                className="w-full border-none ring-0 outline-none focus:outline-none focus:ring-0 text-sm font-normal bg-transparent text-foreground placeholder:text-muted-foreground/90"
              />
            </div>

            {activeTab === "commission" ? (
              <div className="w-full max-w-[280px]">
                <DateRangePicker
                  onChange={(v) => {
                    setPage(1);
                    setDateRange({
                      startDate: normalizeDateParam(v?.startDate),
                      endDate: normalizeDateParam(v?.endDate),
                    });
                  }}
                  buttonClassName="justify-start"
                  textClassName="whitespace-nowrap"
                />
              </div>
            ) : null}
          </div>

          <FinancialTable
            tab={activeTab}
            rows={tableState?.rows || []}
            sortConfig={sortConfig}
            onSort={(key) => {
              setPage(1);
              setSortConfig((prev) =>
                prev?.key === key
                  ? {
                      key,
                      direction: prev.direction === "asc" ? "desc" : "asc",
                    }
                  : { key, direction: "desc" },
              );
            }}
            onRevenueDownload={handleRevenueDownload}
            onCommissionDownload={handleCommissionDownload}
          />

          <div className="px-5 pb-3">
            <Pagination
              currentPage={tableState?.pagination?.page || 1}
              totalPages={tableState?.pagination?.pages || 1}
              totalItems={tableState?.pagination?.total || 0}
              pageSize={tableState?.pagination?.limit || 8}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Financial;

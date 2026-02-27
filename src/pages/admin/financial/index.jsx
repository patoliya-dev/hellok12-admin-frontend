import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

import RoleBasedHeader from "components/ui/RoleBasedHeader";
import Icon from "components/AppIcon";
import Pagination from "components/ui/Pagination";
import DateRangePicker from "components/ui/DateRangePicker";
import Select from "components/ui/Select";
import Input from "components/ui/Input";

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
  fetchFinancialPayoutReport,
  fetchFinancialRevenueReport,
} from "../../../services/financial/financial.service";
import { payoutService } from "../../../services/payouts/payout.service";
import { errorToast, successToast } from "../../../utils/utils";

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
const PAYEE_TYPE_OPTIONS = [
  { label: "All Payee Types", value: "" },
  { label: "Teacher", value: "TEACHER" },
  { label: "School", value: "SCHOOL" },
];
const PAYOUT_STATUS_OPTIONS = [
  { label: "All Statuses", value: "" },
  { label: "Draft", value: "DRAFT" },
  { label: "Approved", value: "APPROVED" },
  { label: "Paid", value: "PAID" },
  { label: "Cancelled", value: "CANCELLED" },
];

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
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [period, setPeriod] = useState("weekly");
  const summary = useSelector(selectFinancialSummaryByPeriod(period));
  const trend = useSelector(selectFinancialTrend);

  const payout = useSelector(selectPayout);
  const revenue = useSelector(selectRevenue);
  const commission = useSelector(selectCommission);

  const trendReq = useSelector(selectFinancialReq("trend"));
  const summaryReq = useSelector(selectFinancialReq("summary"));

  const [activeTab, setActiveTab] = useState(() => {
    const tab = String(searchParams.get("tab") || "").toLowerCase();
    if (tab === "payout" || tab === "revenue" || tab === "commission")
      return tab;
    return "commission";
  });

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "desc",
  });

  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const [payoutFilters, setPayoutFilters] = useState({
    payeeType: "",
    status: "",
    from: "",
    to: "",
  });
  const [payoutActionLoadingId, setPayoutActionLoadingId] = useState("");
  const [markPaidState, setMarkPaidState] = useState({
    open: false,
    row: null,
    paymentRef: "",
    note: "",
  });

  /**
   * Centralized payout list fetch to keep approve/cancel/mark-paid refresh behavior consistent
   * with whatever table filters/sort/pagination are currently active.
   */
  const loadPayouts = useCallback(() => {
    const params = {
      page,
      limit: TABLE_LIMIT,
      search: debouncedSearch,
    };

    if (sortConfig?.key) {
      params.sortBy = sortConfig.key;
      params.sortOrder = sortConfig.direction || "desc";
    }
    if (payoutFilters.payeeType) params.payeeType = payoutFilters.payeeType;
    if (payoutFilters.status) params.status = payoutFilters.status;
    if (payoutFilters.from) params.from = payoutFilters.from;
    if (payoutFilters.to) params.to = payoutFilters.to;

    dispatch(getPayouts(params));
  }, [debouncedSearch, dispatch, page, payoutFilters, sortConfig]);

  // Summary is period-dependent only; avoid re-fetching when tab changes.
  useEffect(() => {
    if (summary) return;
    dispatch(getFinancialSummary({ period }));
  }, [dispatch, period, summary]);

  useEffect(() => {
    // Trend source changes with tab (payout vs revenue vs commission), so always refresh on tab/period change.
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
    // Use blob-based download so API can return binary PDF data directly.
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

  const handleRevenueDownload = useCallback(
    async (row) => {
      if (!row?.courseId) return;
      try {
        const params = {};
        const response = await fetchFinancialRevenueReport(
          row.courseId,
          params,
        );
        await downloadReport({
          response,
          fileName: `${toSafeFileName(row.courseTitle, "revenue-report")}.pdf`,
        });
      } catch (error) {
        console.error("Failed to download revenue report", error);
      }
    },
    [downloadReport],
  );

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

  const handlePayoutDownload = useCallback(
    async (row) => {
      if (!row?._id) return;
      try {
        const response = await fetchFinancialPayoutReport(row._id);
        await downloadReport({
          response,
          fileName: `payout-${String(row._id).slice(-8)}.pdf`,
        });
      } catch (error) {
        console.error("Failed to download payout report", error);
      }
    },
    [downloadReport],
  );

  useEffect(() => {
    // Debounce search text to avoid high-frequency API calls while typing.
    const t = setTimeout(() => {
      setPage(1);
      setDebouncedSearch(search.trim());
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    // Persist selected tab in URL to preserve context on refresh/navigation.
    setSearchParams({ tab: activeTab }, { replace: true });
  }, [activeTab, setSearchParams]);

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

    // Commission tab reads date-range filters from the upper picker.
    if (
      activeTab === "commission" &&
      dateRange?.startDate &&
      dateRange?.endDate
    ) {
      params.startDate = dateRange.startDate;
      params.endDate = dateRange.endDate;
    }

    if (activeTab === "payout") loadPayouts();
    else if (activeTab === "revenue") dispatch(getRevenue(params));
    else dispatch(getCommission(params));
  }, [
    activeTab,
    dateRange?.endDate,
    dateRange?.startDate,
    debouncedSearch,
    dispatch,
    loadPayouts,
    page,
    payoutFilters.from,
    payoutFilters.payeeType,
    payoutFilters.status,
    payoutFilters.to,
    sortConfig,
  ]);

  const handlePayoutApprove = useCallback(
    async (row) => {
      if (!row?._id) return;
      try {
        setPayoutActionLoadingId(row._id);
        await payoutService.approve(row._id);
        successToast("Payout approved");
        loadPayouts();
      } catch (e) {
        errorToast(
          e?.response?.data?.error ||
            e?.response?.data?.message ||
            "Failed to approve payout",
        );
      } finally {
        setPayoutActionLoadingId("");
      }
    },
    [loadPayouts],
  );

  const handlePayoutCancel = useCallback(
    async (row) => {
      if (!row?._id) return;
      try {
        setPayoutActionLoadingId(row._id);
        await payoutService.cancel(row._id, {});
        successToast("Payout cancelled");
        loadPayouts();
      } catch (e) {
        errorToast(
          e?.response?.data?.error ||
            e?.response?.data?.message ||
            "Failed to cancel payout",
        );
      } finally {
        setPayoutActionLoadingId("");
      }
    },
    [loadPayouts],
  );

  const handleSubmitMarkPaid = useCallback(async () => {
    if (!markPaidState?.row?._id) return;
    if (!markPaidState?.paymentRef?.trim()) {
      errorToast("Payment reference is required");
      return;
    }

    try {
      setPayoutActionLoadingId(markPaidState.row._id);
      await payoutService.markPaid(markPaidState.row._id, {
        paymentRef: markPaidState.paymentRef.trim(),
        note: markPaidState.note.trim(),
      });
      successToast("Payout marked as paid");
      setMarkPaidState({ open: false, row: null, paymentRef: "", note: "" });
      loadPayouts();
    } catch (e) {
      errorToast(
        e?.response?.data?.error ||
          e?.response?.data?.message ||
          "Failed to mark payout paid",
      );
    } finally {
      setPayoutActionLoadingId("");
    }
  }, [loadPayouts, markPaidState]);

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
        <div className="mt-6 border-b border-border overflow-x-auto">
          <div className="flex gap-6 sm:gap-8 text-sm min-w-max">
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
                  setPayoutFilters({
                    payeeType: "",
                    status: "",
                    from: "",
                    to: "",
                  });
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
        <section className="mt-6 bg-card border border-border rounded-xl p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-semibold text-foreground capitalize">
              {activeTab}
            </h3>

            <div className="bg-muted rounded-lg p-1 inline-flex w-full sm:w-auto overflow-x-auto">
              {PERIODS.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setPeriod(p.key)}
                  className={[
                    "px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition whitespace-nowrap",
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
          <div className="p-4 sm:p-5 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3 sm:gap-4">
            <div className="h-10 flex items-center gap-3 w-full xl:max-w-[740px] bg-background border border-border rounded-md px-4">
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
              <div className="w-full sm:max-w-[280px]">
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
            ) : activeTab === "payout" ? (
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
                <div className="w-full">
                  <Select
                    options={PAYEE_TYPE_OPTIONS}
                    value={payoutFilters.payeeType}
                    onChange={(value) => {
                      setPage(1);
                      setPayoutFilters((prev) => ({
                        ...prev,
                        payeeType: value || "",
                      }));
                    }}
                  />
                </div>
                <div className="w-full">
                  <Select
                    options={PAYOUT_STATUS_OPTIONS}
                    value={payoutFilters.status}
                    onChange={(value) => {
                      setPage(1);
                      setPayoutFilters((prev) => ({
                        ...prev,
                        status: value || "",
                      }));
                    }}
                  />
                </div>
                <div className="w-full">
                  <Input
                    type="date"
                    value={payoutFilters.from}
                    onChange={(e) => {
                      setPage(1);
                      setPayoutFilters((prev) => ({
                        ...prev,
                        from: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div className="w-full">
                  <Input
                    type="date"
                    value={payoutFilters.to}
                    onChange={(e) => {
                      setPage(1);
                      setPayoutFilters((prev) => ({
                        ...prev,
                        to: e.target.value,
                      }));
                    }}
                  />
                </div>
                <button
                  type="button"
                  className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-semibold whitespace-nowrap w-full lg:w-auto"
                  onClick={() => navigate("/admin/payouts/new")}
                >
                  Create Payout
                </button>
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
            onPayoutAction={(row) => navigate(`/admin/payouts/${row?._id}`)}
            onPayoutDownload={handlePayoutDownload}
            onPayoutApprove={handlePayoutApprove}
            onPayoutCancel={handlePayoutCancel}
            onPayoutMarkPaid={(row) =>
              setMarkPaidState({
                open: true,
                row,
                paymentRef: "",
                note: "",
              })
            }
            payoutActionLoadingId={payoutActionLoadingId}
          />

          <div className="px-3 sm:px-5 pb-3">
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

      {markPaidState.open ? (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
          <div className="w-full max-w-[540px] rounded-xl bg-card border border-border p-5 shadow-lg">
            <h3 className="text-lg font-semibold text-foreground">
              Mark Payout as Paid
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {markPaidState?.row?.instructorName || "Payee"} |{" "}
              {markPaidState?.row?.transactionId || "—"}
            </p>
            <div className="mt-4 space-y-3">
              <Input
                label="Payment Reference"
                value={markPaidState.paymentRef}
                onChange={(e) =>
                  setMarkPaidState((prev) => ({
                    ...prev,
                    paymentRef: e.target.value,
                  }))
                }
                placeholder="Enter UTR / transaction reference"
              />
              <Input
                label="Note"
                value={markPaidState.note}
                onChange={(e) =>
                  setMarkPaidState((prev) => ({
                    ...prev,
                    note: e.target.value,
                  }))
                }
                placeholder="Optional note"
              />
            </div>
            <div className="mt-5 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2">
              <button
                type="button"
                className="px-4 py-2 rounded-md border border-border text-sm w-full sm:w-auto"
                onClick={() =>
                  setMarkPaidState({
                    open: false,
                    row: null,
                    paymentRef: "",
                    note: "",
                  })
                }
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-semibold w-full sm:w-auto"
                onClick={handleSubmitMarkPaid}
                disabled={payoutActionLoadingId === markPaidState?.row?._id}
              >
                {payoutActionLoadingId === markPaidState?.row?._id
                  ? "Saving..."
                  : "Mark Paid"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Financial;

import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import RoleBasedHeader from "components/ui/RoleBasedHeader";
import Select from "components/ui/Select";
import Input from "components/ui/Input";
import {
  clearPayoutPreview,
  selectPayoutPreview,
  selectPayoutReq,
} from "reducers/payouts/payoutSlice";
import { createPayout, previewPayout } from "reducers/payouts/payoutThunks";
import { superAdminService } from "../../../services/superAdmin/superAdmin.service";
import { errorToast, successToast } from "../../../utils/utils";

const PAYEE_TYPE_OPTIONS = [
  { label: "Teacher", value: "TEACHER" },
  { label: "School", value: "SCHOOL" },
];

const PERIOD_PRESET_OPTIONS = [
  { label: "Custom", value: "CUSTOM" },
  { label: "Weekly", value: "WEEKLY" },
  { label: "Monthly", value: "MONTHLY" },
  { label: "Quarterly", value: "QUARTERLY" },
];

const toDateInput = (date) => {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    "0",
  )}-${String(d.getDate()).padStart(2, "0")}`;
};

const calcDatesForCadence = (cadence) => {
  const now = new Date();
  const end = new Date(now);
  const start = new Date(now);

  if (cadence === "WEEKLY") start.setDate(now.getDate() - 6);
  else if (cadence === "MONTHLY") start.setMonth(now.getMonth(), 1);
  else if (cadence === "QUARTERLY") start.setMonth(now.getMonth() - 2, 1);

  return {
    start: toDateInput(start),
    end: toDateInput(end),
  };
};

const money = (n) =>
  Number(n || 0).toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

const AdminCreatePayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const preview = useSelector(selectPayoutPreview);
  const previewReq = useSelector(selectPayoutReq("preview"));
  const createReq = useSelector(selectPayoutReq("create"));

  const [payeeType, setPayeeType] = useState("TEACHER");
  const [periodPreset, setPeriodPreset] = useState("CUSTOM");
  const [payeeId, setPayeeId] = useState("");
  const [payeeOptions, setPayeeOptions] = useState([]);
  const [loadingPayees, setLoadingPayees] = useState(false);

  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");
  const [adjustments, setAdjustments] = useState([]);

  useEffect(() => {
    dispatch(clearPayoutPreview());
  }, [dispatch]);

  useEffect(() => {
    const load = async () => {
      setLoadingPayees(true);
      try {
        if (payeeType === "TEACHER") {
          const data = await superAdminService.getTeachers({
            page: 1,
            limit: 200,
            teacherType: "independent",
          });
          const rows = data?.teachers || [];
          setPayeeOptions(
            rows.map((item) => ({
              value: item?._id,
              label: item?.name || item?.email || "Teacher",
            })),
          );
        } else {
          const data = await superAdminService.getSchools({
            page: 1,
            limit: 200,
          });
          const rows = data?.schools || [];
          setPayeeOptions(
            rows.map((item) => ({
              value: item?._id,
              label:
                item?.profile?.schoolName ||
                item?.name ||
                item?.email ||
                "School",
            })),
          );
        }
      } catch (e) {
        errorToast(e?.message || e?.error || "Failed to load payees");
        setPayeeOptions([]);
      } finally {
        setLoadingPayees(false);
      }
    };
    load();
  }, [payeeType]);

  useEffect(() => {
    if (periodPreset === "CUSTOM") return;
    const dates = calcDatesForCadence(periodPreset);
    setPeriodStart(dates.start);
    setPeriodEnd(dates.end);
  }, [periodPreset]);

  const adjustmentTotal = useMemo(
    () => adjustments.reduce((sum, a) => sum + Number(a?.amount || 0), 0),
    [adjustments],
  );

  const canPreview = Boolean(payeeType && payeeId && periodStart && periodEnd);

  const handlePreview = async () => {
    if (!canPreview) {
      errorToast("Please fill payee and period");
      return;
    }
    try {
      await dispatch(
        previewPayout({
          payeeType,
          payeeId,
          periodStart,
          periodEnd,
          adjustments: adjustments
            .filter((a) => a?.type && Number(a?.amount))
            .map((a) => ({
              type: a.type,
              amount: Number(a.amount),
              note: a.note || "",
            })),
        }),
      ).unwrap();
    } catch (e) {
      errorToast(e?.error || e?.message || "Preview failed");
    }
  };

  const handleCreate = async () => {
    try {
      const created = await dispatch(
        createPayout({
          payeeType,
          payeeId,
          periodStart,
          periodEnd,
          adjustments: adjustments
            .filter((a) => a?.type && Number(a?.amount))
            .map((a) => ({
              type: a.type,
              amount: Number(a.amount),
              note: a.note || "",
            })),
        }),
      ).unwrap();
      successToast("Payout created");
      navigate(`/admin/payouts/${created?._id}`);
    } catch (e) {
      errorToast(e?.error || e?.message || "Create payout failed");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <RoleBasedHeader />
      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground">
            Create / Preview Payout
          </h1>
          <button
            type="button"
            className="px-4 py-2 rounded-md border border-border text-sm"
            onClick={() => navigate("/admin/payouts")}
          >
            Back to List
          </button>
        </div>

        <section className="mt-5 bg-card border border-border rounded-xl p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Select
              label="Payee Type"
              options={PAYEE_TYPE_OPTIONS}
              value={payeeType}
              onChange={(v) => {
                setPayeeType(v);
                setPayeeId("");
                dispatch(clearPayoutPreview());
              }}
            />
            <Select
              label="Payee"
              options={payeeOptions}
              value={payeeId}
              loading={loadingPayees}
              searchable
              onChange={(v) => {
                setPayeeId(v);
                dispatch(clearPayoutPreview());
              }}
            />
            <Select
              label="Period Preset"
              options={PERIOD_PRESET_OPTIONS}
              value={periodPreset}
              onChange={setPeriodPreset}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="date"
                label="Period Start"
                value={periodStart}
                onChange={(e) => setPeriodStart(e.target.value)}
              />
              <Input
                type="date"
                label="Period End"
                value={periodEnd}
                onChange={(e) => setPeriodEnd(e.target.value)}
              />
            </div>
          </div>
        </section>

        <section className="mt-5 bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-foreground">Adjustments</h2>
            <button
              type="button"
              className="px-3 py-1.5 text-xs rounded-md border border-border"
              onClick={() =>
                setAdjustments((prev) => [
                  ...prev,
                  {
                    id: Date.now() + Math.random(),
                    type: "MANUAL",
                    amount: 0,
                    note: "",
                  },
                ])
              }
            >
              Add Adjustment
            </button>
          </div>
          <div className="space-y-3">
            {adjustments.map((adj, idx) => (
              <div
                key={adj?.id || idx}
                className="grid grid-cols-1 md:grid-cols-4 gap-2"
              >
                <Input
                  label="Type"
                  value={adj.type}
                  onChange={(e) =>
                    setAdjustments((prev) =>
                      prev.map((row, i) =>
                        i === idx ? { ...row, type: e.target.value } : row,
                      ),
                    )
                  }
                />
                <Input
                  type="number"
                  label="Amount (cents)"
                  value={adj.amount}
                  onChange={(e) =>
                    setAdjustments((prev) =>
                      prev.map((row, i) =>
                        i === idx
                          ? { ...row, amount: Number(e.target.value || 0) }
                          : row,
                      ),
                    )
                  }
                />
                <Input
                  label="Note"
                  value={adj.note}
                  onChange={(e) =>
                    setAdjustments((prev) =>
                      prev.map((row, i) =>
                        i === idx ? { ...row, note: e.target.value } : row,
                      ),
                    )
                  }
                />
                <div className="flex items-end">
                  <button
                    type="button"
                    className="px-3 py-2 rounded-md bg-red-600 text-white text-xs"
                    onClick={() =>
                      setAdjustments((prev) => prev.filter((_, i) => i !== idx))
                    }
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            {!adjustments.length ? (
              <p className="text-sm text-muted-foreground">
                No adjustments added
              </p>
            ) : null}
            <p className="text-xs text-muted-foreground">
              Adjustment total (USD): {money(adjustmentTotal / 100)}
            </p>
          </div>
        </section>

        <section className="mt-5 bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="px-4 py-2 rounded-md border border-border text-sm"
              onClick={handlePreview}
              disabled={!canPreview || previewReq?.status === "loading"}
            >
              {previewReq?.status === "loading" ? "Previewing..." : "Preview"}
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm"
              onClick={handleCreate}
              disabled={!preview || createReq?.status === "loading"}
            >
              {createReq?.status === "loading"
                ? "Creating..."
                : "Create Payout"}
            </button>
          </div>

          {preview ? (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="p-3 rounded-md bg-muted/40">
                <p className="text-xs text-muted-foreground">Gross</p>
                <p className="text-lg font-semibold">
                  {money((preview.grossAmount || 0) / 100)}
                </p>
              </div>
              <div className="p-3 rounded-md bg-muted/40">
                <p className="text-xs text-muted-foreground">Platform Fee</p>
                <p className="text-lg font-semibold">
                  {money((preview.platformFeeAmount || 0) / 100)}
                </p>
              </div>
              <div className="p-3 rounded-md bg-muted/40">
                <p className="text-xs text-muted-foreground">
                  Adjustment Total
                </p>
                <p className="text-lg font-semibold">
                  {money((preview.adjustmentTotal || 0) / 100)}
                </p>
              </div>
              <div className="p-3 rounded-md bg-muted/40">
                <p className="text-xs text-muted-foreground">Net</p>
                <p className="text-lg font-semibold">
                  {money((preview.netAmount || 0) / 100)}
                </p>
              </div>
              <div className="md:col-span-4 text-sm text-muted-foreground">
                Eligible line items: {preview?.lineItemsSummary?.count || 0}
              </div>
            </div>
          ) : null}
        </section>
      </main>
    </div>
  );
};

export default AdminCreatePayout;

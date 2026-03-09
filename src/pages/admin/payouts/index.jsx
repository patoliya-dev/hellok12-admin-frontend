import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import RoleBasedHeader from "components/ui/RoleBasedHeader";
import Pagination from "components/ui/Pagination";
import Select from "components/ui/Select";
import Input from "components/ui/Input";
import {
  fetchPayouts,
  approvePayout,
  cancelPayout,
} from "reducers/payouts/payoutThunks";
import {
  selectPayoutList,
  selectPayoutReq,
} from "reducers/payouts/payoutSlice";
import { errorToast, successToast } from "../../../utils/utils";
import PayoutStatusBadge from "./components/PayoutStatusBadge";

const toDateInput = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    "0",
  )}-${String(d.getDate()).padStart(2, "0")}`;
};

const money = (n) =>
  Number(n || 0).toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

const PAYEE_TYPE_OPTIONS = [
  { label: "All", value: "" },
  { label: "Teacher", value: "TEACHER" },
  { label: "School", value: "SCHOOL" },
];

const STATUS_OPTIONS = [
  { label: "All", value: "" },
  { label: "Draft", value: "DRAFT" },
  { label: "Approved", value: "APPROVED" },
  { label: "Paid", value: "PAID" },
  { label: "Cancelled", value: "CANCELLED" },
];

const PAGE_LIMIT = 10;

const AdminPayouts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const payoutState = useSelector(selectPayoutList);
  const listReq = useSelector(selectPayoutReq("list"));
  const approveReq = useSelector(selectPayoutReq("approve"));
  const cancelReq = useSelector(selectPayoutReq("cancel"));

  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    payeeType: "",
    status: "",
    from: "",
    to: "",
  });

  const loading =
    listReq?.status === "loading" ||
    approveReq?.status === "loading" ||
    cancelReq?.status === "loading";

  useEffect(() => {
    dispatch(
      fetchPayouts({
        page,
        limit: PAGE_LIMIT,
        payeeType: filters.payeeType || undefined,
        status: filters.status || undefined,
        from: filters.from || undefined,
        to: filters.to || undefined,
      }),
    );
  }, [dispatch, page, filters]);

  const rows = payoutState?.rows || [];
  const pagination = payoutState?.pagination || {};

  const safePages = useMemo(
    () => Math.max(1, Number(pagination?.pages || 1)),
    [pagination?.pages],
  );

  useEffect(() => {
    if (page > safePages) setPage(safePages);
  }, [page, safePages]);

  const handleAction = async (type, id) => {
    try {
      if (type === "approve") {
        await dispatch(approvePayout(id)).unwrap();
        successToast("Payout approved");
      } else if (type === "cancel") {
        await dispatch(cancelPayout({ id, payload: {} })).unwrap();
        successToast("Payout cancelled");
      }
      dispatch(
        fetchPayouts({
          page,
          limit: PAGE_LIMIT,
          payeeType: filters.payeeType || undefined,
          status: filters.status || undefined,
          from: filters.from || undefined,
          to: filters.to || undefined,
        }),
      );
    } catch (e) {
      errorToast(e?.error || e?.message || "Action failed");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <RoleBasedHeader />
      <main className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Payouts</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manual payout generation and settlement for teachers and schools
            </p>
          </div>
          <button
            type="button"
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-semibold"
            onClick={() => navigate("/admin/payouts/new")}
          >
            Create Payout
          </button>
        </div>

        <section className="mt-5 bg-card border border-border rounded-xl p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <Select
              label="Payee Type"
              options={PAYEE_TYPE_OPTIONS}
              value={filters.payeeType}
              onChange={(v) => {
                setPage(1);
                setFilters((prev) => ({ ...prev, payeeType: v || "" }));
              }}
            />
            <Select
              label="Status"
              options={STATUS_OPTIONS}
              value={filters.status}
              onChange={(v) => {
                setPage(1);
                setFilters((prev) => ({ ...prev, status: v || "" }));
              }}
            />
            <Input
              type="date"
              label="From"
              value={filters.from}
              onChange={(e) => {
                setPage(1);
                setFilters((prev) => ({ ...prev, from: e.target.value }));
              }}
            />
            <Input
              type="date"
              label="To"
              value={filters.to}
              onChange={(e) => {
                setPage(1);
                setFilters((prev) => ({ ...prev, to: e.target.value }));
              }}
            />
          </div>
        </section>

        <section className="mt-5 bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/40">
                <tr>
                  <th className="text-left p-4 text-xs uppercase text-muted-foreground">
                    Payee
                  </th>
                  <th className="text-left p-4 text-xs uppercase text-muted-foreground">
                    Period
                  </th>
                  <th className="text-right p-4 text-xs uppercase text-muted-foreground">
                    Net Amount
                  </th>
                  <th className="text-left p-4 text-xs uppercase text-muted-foreground">
                    Status
                  </th>
                  <th className="text-left p-4 text-xs uppercase text-muted-foreground">
                    Created At
                  </th>
                  <th className="text-right p-4 text-xs uppercase text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const canApprove = row?.status === "DRAFT";
                  const canCancel =
                    row?.status === "DRAFT" || row?.status === "APPROVED";
                  const payeeName =
                    row?.payeeId?.name || row?.payeeId?.email || "Unknown";
                  return (
                    <tr key={row?._id} className="border-t border-border">
                      <td className="p-4 text-sm text-foreground">
                        <div className="font-medium">{payeeName}</div>
                        <div className="text-xs text-muted-foreground">
                          {row?.payeeType || "—"}
                        </div>
                      </td>
                      <td className="p-4 text-sm text-foreground">
                        {toDateInput(row?.periodStart)} to{" "}
                        {toDateInput(row?.periodEnd)}
                      </td>
                      <td className="p-4 text-sm text-right font-semibold text-foreground">
                        {money((row?.netAmount || 0) / 100)}
                      </td>
                      <td className="p-4 text-sm text-foreground">
                        <PayoutStatusBadge status={row?.status} />
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {toDateInput(row?.createdAt)}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            className="px-3 py-1.5 text-xs rounded-md border border-border"
                            onClick={() =>
                              navigate(`/admin/payouts/${row?._id}`)
                            }
                          >
                            View
                          </button>
                          {canApprove ? (
                            <button
                              type="button"
                              className="px-3 py-1.5 text-xs rounded-md bg-blue-600 text-white"
                              onClick={() => handleAction("approve", row?._id)}
                              disabled={loading}
                            >
                              Approve
                            </button>
                          ) : null}
                          {canCancel ? (
                            <button
                              type="button"
                              className="px-3 py-1.5 text-xs rounded-md bg-red-600 text-white"
                              onClick={() => handleAction("cancel", row?._id)}
                              disabled={loading}
                            >
                              Cancel
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {!rows.length ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-8 text-center text-sm text-muted-foreground"
                    >
                      {loading ? "Loading payouts..." : "No payouts found"}
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={pagination?.page || page}
            totalPages={pagination?.pages || 1}
            totalItems={pagination?.total || 0}
            onPageChange={setPage}
            pageSize={pagination?.limit || PAGE_LIMIT}
            listType="payouts"
          />
        </section>
      </main>
    </div>
  );
};

export default AdminPayouts;

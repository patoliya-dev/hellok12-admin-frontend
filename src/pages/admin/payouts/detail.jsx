import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import RoleBasedHeader from "components/ui/RoleBasedHeader";
import Input from "components/ui/Input";
import { errorToast, successToast } from "../../../utils/utils";
import {
  selectPayoutDetail,
  selectPayoutReq,
} from "reducers/payouts/payoutSlice";
import {
  approvePayout,
  cancelPayout,
  fetchPayoutDetail,
  markPayoutPaid,
  verifyPayoutAccount,
  rejectPayoutAccount,
} from "reducers/payouts/payoutThunks";
import PayoutStatusBadge from "./components/PayoutStatusBadge";

const money = (n) =>
  Number(n || 0).toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

const dateText = (v) => {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
};

const AdminPayoutDetail = () => {
  const { payoutId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const payout = useSelector(selectPayoutDetail);
  const req = useSelector(selectPayoutReq("detail"));
  const approveReq = useSelector(selectPayoutReq("approve"));
  const markPaidReq = useSelector(selectPayoutReq("markPaid"));
  const cancelReq = useSelector(selectPayoutReq("cancel"));
  const verifyAccountReq = useSelector(selectPayoutReq("verifyAccount"));
  const rejectAccountReq = useSelector(selectPayoutReq("rejectAccount"));

  const [paymentRef, setPaymentRef] = useState("");
  const [note, setNote] = useState("");
  const payoutAccountSummary = payout?.payoutAccountSummary || null;
  const payoutAccountId = payoutAccountSummary?._id || null;
  const bankVerified =
    String(payoutAccountSummary?.status || "") === "VERIFIED";

  useEffect(() => {
    if (!payoutId) return;
    dispatch(fetchPayoutDetail(payoutId));
  }, [dispatch, payoutId]);

  const refresh = () => {
    if (!payoutId) return;
    dispatch(fetchPayoutDetail(payoutId));
  };

  const onApprove = async () => {
    try {
      await dispatch(approvePayout(payoutId)).unwrap();
      successToast("Payout approved");
      refresh();
    } catch (e) {
      errorToast(e?.error || e?.message || "Failed to approve payout");
    }
  };

  const onCancel = async () => {
    try {
      await dispatch(
        cancelPayout({ id: payoutId, payload: { note } }),
      ).unwrap();
      successToast("Payout cancelled");
      refresh();
    } catch (e) {
      errorToast(e?.error || e?.message || "Failed to cancel payout");
    }
  };

  const onMarkPaid = async () => {
    if (!paymentRef.trim()) {
      errorToast("Payment reference is required");
      return;
    }
    try {
      await dispatch(
        markPayoutPaid({
          id: payoutId,
          payload: { paymentRef: paymentRef.trim(), note: note.trim() },
        }),
      ).unwrap();
      successToast("Payout marked as paid");
      refresh();
    } catch (e) {
      errorToast(e?.error || e?.message || "Failed to mark payout paid");
    }
  };

  const onVerifyAccount = async () => {
    if (!payoutAccountId) {
      errorToast("Payout account not found");
      return;
    }

    try {
      await dispatch(
        verifyPayoutAccount({
          id: payoutAccountId,
          payload: {},
        }),
      ).unwrap();
      successToast("Payout account verified");
      refresh();
    } catch (e) {
      errorToast(e?.error || e?.message || "Failed to verify payout account");
    }
  };

  const onRejectAccount = async () => {
    if (!payoutAccountId) {
      errorToast("Payout account not found");
      return;
    }

    if (!note?.trim() || note.trim().length < 3) {
      errorToast("Enter rejection reason (minimum 3 characters) in note");
      return;
    }

    try {
      await dispatch(
        rejectPayoutAccount({
          id: payoutAccountId,
          payload: { reason: note.trim() },
        }),
      ).unwrap();
      successToast("Payout account rejected");
      refresh();
    } catch (e) {
      errorToast(e?.error || e?.message || "Failed to reject payout account");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <RoleBasedHeader />
      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground">
            Payout Detail
          </h1>
          <button
            type="button"
            className="px-4 py-2 rounded-md border border-border text-sm"
            onClick={() => navigate("/admin/payouts")}
          >
            Back to List
          </button>
        </div>

        {!payout ? (
          <div className="mt-5 bg-card border border-border rounded-xl p-6 text-sm text-muted-foreground">
            {req?.status === "loading"
              ? "Loading payout..."
              : "Payout not found"}
          </div>
        ) : (
          <>
            <section className="mt-5 bg-card border border-border rounded-xl p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Payee</p>
                  <p className="text-sm font-medium text-foreground">
                    {payout?.payeeId?.name || payout?.payeeId?.email || "—"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {payout?.payeeType || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Period</p>
                  <p className="text-sm text-foreground">
                    {dateText(payout?.periodStart)} to{" "}
                    {dateText(payout?.periodEnd)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <div className="mt-1">
                    <PayoutStatusBadge status={payout?.status} />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4">
                <div className="p-3 rounded-md bg-muted/40">
                  <p className="text-xs text-muted-foreground">Gross</p>
                  <p className="text-lg font-semibold">
                    {money((payout?.grossAmount || payout?.amount || 0) / 100)}
                  </p>
                </div>
                <div className="p-3 rounded-md bg-muted/40">
                  <p className="text-xs text-muted-foreground">Platform Fee</p>
                  <p className="text-lg font-semibold">
                    {money((payout?.platformFee || 0) / 100)}
                  </p>
                </div>
                <div className="p-3 rounded-md bg-muted/40">
                  <p className="text-xs text-muted-foreground">Net</p>
                  <p className="text-lg font-semibold">
                    {money((payout?.netAmount || 0) / 100)}
                  </p>
                </div>
                <div className="p-3 rounded-md bg-muted/40">
                  <p className="text-xs text-muted-foreground">Line Items</p>
                  <p className="text-lg font-semibold">
                    {(payout?.lineItems || []).length}
                  </p>
                </div>
              </div>
            </section>

            <section className="mt-5 bg-card border border-border rounded-xl p-4">
              <h2 className="font-semibold text-foreground">Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                <Input
                  label="Payment Reference (UTR / Txn)"
                  value={paymentRef}
                  onChange={(e) => setPaymentRef(e.target.value)}
                  placeholder="e.g. UTR-12345"
                />
                <Input
                  label="Note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Optional note"
                />
              </div>
              <div className="flex items-center gap-2 mt-4">
                {payout?.status === "DRAFT" ? (
                  <button
                    type="button"
                    className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm"
                    onClick={onApprove}
                    disabled={approveReq?.status === "loading"}
                  >
                    Approve
                  </button>
                ) : null}
                {payout?.status === "APPROVED" ? (
                  <button
                    type="button"
                    className="px-4 py-2 rounded-md bg-emerald-600 text-white text-sm"
                    onClick={onMarkPaid}
                    disabled={
                      markPaidReq?.status === "loading" || !bankVerified
                    }
                  >
                    Mark Paid
                  </button>
                ) : null}
                {payout?.status === "DRAFT" || payout?.status === "APPROVED" ? (
                  <button
                    type="button"
                    className="px-4 py-2 rounded-md bg-red-600 text-white text-sm"
                    onClick={onCancel}
                    disabled={cancelReq?.status === "loading"}
                  >
                    Cancel
                  </button>
                ) : null}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Paid At: {dateText(payout?.paidAt)} | Payment Ref:{" "}
                {payout?.paymentRef || "—"}
              </p>
              {payout?.status === "APPROVED" && !bankVerified ? (
                <p className="text-xs text-red-600 mt-2">
                  Mark paid is disabled until payout account is VERIFIED.
                </p>
              ) : null}
            </section>

            <section className="mt-5 bg-card border border-border rounded-xl p-4">
              <h2 className="font-semibold text-foreground">Bank Details</h2>
              {!payoutAccountSummary ? (
                <p className="mt-2 text-sm text-red-600">
                  No payout account found for this payee.
                </p>
              ) : (
                <>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      className="px-3 py-1.5 text-xs rounded-md bg-emerald-600 text-white disabled:opacity-50"
                      onClick={onVerifyAccount}
                      disabled={
                        verifyAccountReq?.status === "loading" || bankVerified
                      }
                    >
                      Verify Account
                    </button>
                    <button
                      type="button"
                      className="px-3 py-1.5 text-xs rounded-md bg-red-600 text-white disabled:opacity-50"
                      onClick={onRejectAccount}
                      disabled={
                        rejectAccountReq?.status === "loading" ||
                        String(payoutAccountSummary?.status || "") ===
                          "REJECTED"
                      }
                    >
                      Reject Account
                    </button>
                    <span className="text-xs text-muted-foreground">
                      Use Note field above as rejection reason.
                    </span>
                  </div>
                  {payoutAccountSummary?.status === "REJECTED" &&
                  payoutAccountSummary?.rejectionReason ? (
                    <p className="mt-2 text-xs text-red-600">
                      Rejection reason: {payoutAccountSummary.rejectionReason}
                    </p>
                  ) : null}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                    <div className="p-3 rounded-md bg-muted/40">
                      <p className="text-xs text-muted-foreground">
                        Holder Name
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {payoutAccountSummary?.holderName || "—"}
                      </p>
                    </div>
                    <div className="p-3 rounded-md bg-muted/40">
                      <p className="text-xs text-muted-foreground">Bank Name</p>
                      <p className="text-sm font-medium text-foreground">
                        {payoutAccountSummary?.bankName || "—"}
                      </p>
                    </div>
                    <div className="p-3 rounded-md bg-muted/40">
                      <p className="text-xs text-muted-foreground">
                        Account Number
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {payoutAccountSummary?.maskedAccountNumber || "—"}
                      </p>
                    </div>
                    <div className="p-3 rounded-md bg-muted/40">
                      <p className="text-xs text-muted-foreground">IFSC</p>
                      <p className="text-sm font-medium text-foreground">
                        {payoutAccountSummary?.ifsc || "—"}
                      </p>
                    </div>
                    <div className="p-3 rounded-md bg-muted/40">
                      <p className="text-xs text-muted-foreground">UPI</p>
                      <p className="text-sm font-medium text-foreground">
                        {payoutAccountSummary?.upiId || "—"}
                      </p>
                    </div>
                    <div className="p-3 rounded-md bg-muted/40">
                      <p className="text-xs text-muted-foreground">Status</p>
                      <p
                        className={`text-sm font-semibold ${bankVerified ? "text-emerald-700" : "text-amber-700"}`}
                      >
                        {payoutAccountSummary?.status || "PENDING"}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </section>

            <section className="mt-5 bg-card border border-border rounded-xl p-4">
              <h2 className="font-semibold text-foreground">
                Line Item Summary
              </h2>
              <div className="mt-3 max-h-[320px] overflow-auto border border-border rounded-md">
                <table className="w-full">
                  <thead className="bg-muted/40">
                    <tr>
                      <th className="text-left p-3 text-xs uppercase text-muted-foreground">
                        Ref
                      </th>
                      <th className="text-right p-3 text-xs uppercase text-muted-foreground">
                        Gross
                      </th>
                      <th className="text-right p-3 text-xs uppercase text-muted-foreground">
                        Fee
                      </th>
                      <th className="text-right p-3 text-xs uppercase text-muted-foreground">
                        Net
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(payout?.lineItems || []).map((item, idx) => (
                      <tr
                        key={`${item?.transactionId || idx}`}
                        className="border-t border-border"
                      >
                        <td className="p-3 text-xs text-foreground">
                          {item?.reference ||
                            String(item?.transactionId || "—")}
                        </td>
                        <td className="p-3 text-xs text-right text-foreground">
                          {money((item?.amount || 0) / 100)}
                        </td>
                        <td className="p-3 text-xs text-right text-foreground">
                          {money((item?.platformFee || 0) / 100)}
                        </td>
                        <td className="p-3 text-xs text-right text-foreground">
                          {money((item?.netAmount || 0) / 100)}
                        </td>
                      </tr>
                    ))}
                    {!(payout?.lineItems || []).length ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="p-4 text-center text-sm text-muted-foreground"
                        >
                          No line items
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminPayoutDetail;

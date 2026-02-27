import React from "react";

const STYLE_BY_STATUS = {
  DRAFT: "bg-slate-100 text-slate-700",
  APPROVED: "bg-blue-100 text-blue-700",
  PAID: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const PayoutStatusBadge = ({ status }) => {
  const key = String(status || "").toUpperCase();
  const cls = STYLE_BY_STATUS[key] || "bg-slate-100 text-slate-700";
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${cls}`}>
      {key || "—"}
    </span>
  );
};

export default PayoutStatusBadge;

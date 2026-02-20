import React from "react";
import Icon from "components/AppIcon";

const money = (n) =>
  Number(n || 0).toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

const Card = ({ title, amount, pct, label }) => {
  const up = Number(pct || 0) >= 0;
  return (
    <div className="text-center">
      <div className="text-sm text-muted-foreground">{title}</div>
      <div className="mt-2 text-4xl font-bold text-foreground">
        {money(amount)}
      </div>
      <div className="mt-3 flex items-center gap-3 text-sm justify-center">
        <span className={up ? "text-success" : "text-destructive"}>
          <span className="inline-flex items-center gap-1">
            <Icon name={up ? "TrendingUp" : "TrendingDown"} size={16} />
            {Math.abs(Number(pct || 0))}%
          </span>
        </span>
        <span className="text-muted-foreground">{label}</span>
      </div>
    </div>
  );
};

const FinancialTopCards = ({ summary, loading }) => {
  const s = summary || {};
  return (
    <section className="mt-6">
      <div className="bg-card border border-border rounded-xl p-6 grid gap-8 grid-cols-1 md:grid-cols-3">
        <Card
          title="Total Payouts"
          amount={loading ? 0 : s?.totalPayouts?.amount}
          pct={loading ? 0 : s?.totalPayouts?.percentageChange}
          label={s?.totalPayouts?.comparisonPeriod || "vs previous month"}
        />
        <Card
          title="Commission  Earnings"
          amount={loading ? 0 : s?.commissionEarnings?.amount}
          pct={loading ? 0 : s?.commissionEarnings?.percentageChange}
          label={s?.commissionEarnings?.comparisonPeriod || "vs previous month"}
        />
        <Card
          title="Total Earnings"
          amount={loading ? 0 : s?.totalEarnings?.amount}
          pct={loading ? 0 : s?.totalEarnings?.percentageChange}
          label={s?.totalEarnings?.comparisonPeriod || "vs previous month"}
        />
      </div>
    </section>
  );
};

export default FinancialTopCards;

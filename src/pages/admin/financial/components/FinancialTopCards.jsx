import React from "react";
import Icon from "components/AppIcon";

const money = (n) =>
  Number(n || 0).toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

const formatPct = (value) => {
  const n = Number(value || 0);
  if (!Number.isFinite(n)) return { display: "0%", exact: "0%", capped: false };
  const abs = Math.abs(n);
  const exact = `${abs.toLocaleString(undefined, { maximumFractionDigits: 1 })}%`;
  // Clamp huge growth values in card UI to keep layout stable; expose exact value in tooltip.
  if (abs > 999.9) {
    return { display: "999.9%+", exact, capped: true };
  }
  return { display: exact, exact, capped: false };
};

const Card = ({ title, amount, pct, label }) => {
  const up = Number(pct || 0) >= 0;
  const pctMeta = formatPct(pct);
  return (
    <div className="text-left sm:text-center">
      <div className="text-sm text-muted-foreground">{title}</div>
      <div className="mt-2 text-2xl sm:text-3xl xl:text-4xl font-bold text-foreground break-words">
        {money(amount)}
      </div>
      <div className="mt-3 flex items-center gap-2 sm:gap-3 text-sm justify-start sm:justify-center flex-wrap">
        <span className={up ? "text-success" : "text-destructive"}>
          <span
            className="inline-flex items-center gap-1 whitespace-nowrap"
            title={`Exact change: ${pctMeta.exact}`}
          >
            <Icon name={up ? "TrendingUp" : "TrendingDown"} size={16} />
            {pctMeta.display}
            {pctMeta.capped ? (
              <Icon
                name="Info"
                size={13}
                className="text-muted-foreground"
                title={`Exact change: ${pctMeta.exact}`}
              />
            ) : null}
          </span>
        </span>
        <span className="text-muted-foreground whitespace-nowrap">{label}</span>
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
          title="Commission Earnings"
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

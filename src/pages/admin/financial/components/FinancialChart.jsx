import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(value);

const FinancialChart = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        Loading chart data...
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data || []}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis
          dataKey="period"
          stroke="var(--color-muted-foreground)"
          fontSize={12}
        />
        <YAxis
          stroke="var(--color-muted-foreground)"
          fontSize={12}
          tickFormatter={formatCurrency}
        />
        <Tooltip
          formatter={(v) => [formatCurrency(v), "Amount"]}
          contentStyle={{
            backgroundColor: "var(--color-popover)",
            border: "1px solid var(--color-border)",
            borderRadius: "8px",
          }}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="var(--color-primary)"
          strokeWidth={3}
          dot={{ fill: "var(--color-primary)", strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: "var(--color-primary)", strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default FinancialChart;

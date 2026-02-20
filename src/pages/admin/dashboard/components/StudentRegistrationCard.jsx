import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Icon from "components/AppIcon";

const formatWhole = (n) => Number(n || 0).toLocaleString("en-US");
const formatAxisValue = (n) => {
  const value = Number(n || 0);
  if (Math.abs(value) >= 1000) return `${Math.round(value / 1000)}k`;
  return `${value}`;
};

const chartAxisStyle = {
  fontSize: 12,
  fill: "var(--color-muted-foreground)",
};

const barTooltip = (value) => [formatWhole(value), "Registrations"];

const StudentRegistrationCard = ({ data, trend }) => {
  const isUp = trend?.direction !== "down";
  const pct = Math.abs(Number(trend?.deltaPercentage || 0)).toFixed(1);

  return (
    <article className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-[34px] leading-none font-semibold text-foreground">
          Student Registration Growth
        </h3>
        <div
          className={`inline-flex items-center gap-2 text-sm font-semibold ${
            isUp ? "text-[#059669]" : "text-destructive"
          }`}
        >
          <Icon name={isUp ? "TrendingUp" : "TrendingDown"} size={14} />
          {isUp ? "+" : "-"}
          {pct}% vs last period
        </div>
      </div>

      <div className="mt-6 h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -14, bottom: 0 }}>
            <CartesianGrid strokeDasharray="4 4" stroke="var(--color-border)" />
            <XAxis dataKey="label" stroke="var(--color-muted-foreground)" tick={chartAxisStyle} />
            <YAxis
              stroke="var(--color-muted-foreground)"
              tick={chartAxisStyle}
              tickFormatter={formatAxisValue}
              tickCount={5}
            />
            <Tooltip
              formatter={barTooltip}
              contentStyle={{
                borderRadius: "10px",
                border: "1px solid var(--color-border)",
                backgroundColor: "var(--color-card)",
              }}
            />
            <Bar
              dataKey="value"
              fill="var(--color-primary)"
              radius={[6, 6, 0, 0]}
              barSize={36}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
};

export default StudentRegistrationCard;


import React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

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

const lineTooltip = (value) => [formatWhole(value), "Count"];

const LineGrowthCard = ({ title, data, lineColor }) => (
  <article className="rounded-xl border border-border bg-card p-6">
    <h3 className="text-[34px] leading-none font-semibold text-foreground">{title}</h3>
    <div className="mt-6 h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 6, left: -14, bottom: 0 }}>
          <CartesianGrid strokeDasharray="4 4" stroke="var(--color-border)" />
          <XAxis dataKey="label" stroke="var(--color-muted-foreground)" tick={chartAxisStyle} />
          <YAxis
            stroke="var(--color-muted-foreground)"
            tick={chartAxisStyle}
            tickFormatter={formatAxisValue}
            tickCount={5}
          />
          <Tooltip
            formatter={lineTooltip}
            contentStyle={{
              borderRadius: "10px",
              border: "1px solid var(--color-border)",
              backgroundColor: "var(--color-card)",
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={lineColor}
            strokeWidth={3}
            dot={{ r: 4, fill: lineColor }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </article>
);

export default LineGrowthCard;


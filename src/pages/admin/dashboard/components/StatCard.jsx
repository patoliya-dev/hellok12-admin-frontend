import React from "react";
import Icon from "components/AppIcon";

const formatWhole = (n) => Number(n || 0).toLocaleString("en-US");

const StatCard = ({ icon, iconBg, title, value }) => (
  <article className="h-[96px] rounded-lg border border-border bg-card px-5 py-4">
    <div className="flex items-center gap-4">
      <div
        className="h-10 w-10 rounded-md text-white flex items-center justify-center shrink-0"
        style={{ backgroundColor: iconBg }}
      >
        <Icon name={icon} size={18} />
      </div>
      <div>
        <p className="text-[34px] leading-[1] font-bold text-foreground tracking-tight">
          {formatWhole(value)}
        </p>
        <p className="mt-1 text-sm leading-none text-muted-foreground">{title}</p>
      </div>
    </div>
  </article>
);

export default StatCard;


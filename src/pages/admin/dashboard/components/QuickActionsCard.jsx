import React from "react";
import { useNavigate } from "react-router-dom";
import Icon from "components/AppIcon";

const QuickActionsCard = ({ actions }) => {
  const navigate = useNavigate();

  return (
    <article className="rounded-xl border border-border bg-card p-6">
      <h3 className="text-[34px] leading-none font-semibold text-foreground">Quick Actions</h3>
      <p className="mt-2 text-base leading-none text-muted-foreground">Common administrative tasks</p>

      <div className="mt-6">
        {actions.map((action, idx) => (
          <button
            key={action.title}
            type="button"
            onClick={() => navigate(action.to)}
            className={`w-full flex items-center gap-4 rounded-lg px-4 py-4 hover:bg-muted/40 transition ${
              idx !== actions.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <span
              className="h-12 w-12 rounded-md text-white flex items-center justify-center"
              style={{ backgroundColor: action.iconBg }}
            >
              <Icon name={action.icon} size={20} />
            </span>
            <span className="flex-1 text-left">
              <span className="block text-[16px] leading-none font-medium text-foreground">
                {action.title}
              </span>
              <span className="block mt-1 text-[14px] leading-none text-muted-foreground">
                {action.subtitle}
              </span>
            </span>
            <Icon name="ChevronRight" size={18} className="text-muted-foreground" />
          </button>
        ))}
      </div>
    </article>
  );
};

export default QuickActionsCard;


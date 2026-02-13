import React from "react";

const colorMap = {
  green: "text-green-400",
  red: "text-red-400",
  blue: "text-blue-400",
};

const borderMap = {
  green: "border-green-500/30",
  red: "border-red-500/30",
  blue: "border-blue-500/30",
};

const StatCard = ({
  label,
  value,
  highlight,
  icon,
  trend, // optional: +5% / -2%
}) => {
  return (
    <div
      className={`bg-slate-800 border rounded-xl p-4 transition hover:scale-[1.02] hover:shadow-md ${
        borderMap[highlight] || "border-slate-700"
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="text-xs text-slate-400">
          {label}
        </div>

        {icon && (
          <div className="text-slate-500 text-sm">
            {icon}
          </div>
        )}
      </div>

      <div
        className={`text-2xl font-semibold tracking-tight ${
          colorMap[highlight] || ""
        }`}
      >
        {value}
      </div>

      {trend && (
        <div
          className={`text-xs mt-2 ${
            trend.startsWith("-")
              ? "text-red-400"
              : "text-green-400"
          }`}
        >
          {trend} from last period
        </div>
      )}
    </div>
  );
};

export default StatCard;

import React from "react";

const colorMap = {
  green: "text-green-400",
  red: "text-red-400",
  blue: "text-blue-400",
};

const StatCard = ({ label, value, highlight }) => {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 shadow-sm">
      <div className="text-xs text-slate-400 mb-1">
        {label}
      </div>
      <div className={`text-2xl font-semibold ${colorMap[highlight] || ""}`}>
        {value}
      </div>
    </div>
  );
};

export default StatCard;

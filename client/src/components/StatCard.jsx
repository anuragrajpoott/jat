import React from "react";

const StatCard = ({ label, value }) => (
  <div className="bg-white dark:bg-slate-900 
                  border border-[#e5caca] dark:border-slate-800 
                  rounded-xl p-4 text-center">
    <p className="text-sm text-slate-500 dark:text-slate-400">
      {label}
    </p>
    <p className="text-2xl font-semibold mt-1">
      {value}
    </p>
  </div>
);

export default StatCard

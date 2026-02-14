/* ---------- Status Select ---------- */
import React from "react";

const STATUS_OPTIONS = [
  "saved",
  "applied",
  "shortlisted",
  "interview",
  "offer",
  "rejected",
];

const StatusSelect = ({ value, onChange }) => {
  const colors = {
    saved: "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
    applied: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    shortlisted: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300",
    interview: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
    offer: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
    rejected: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  };

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`rounded-full px-3 py-1 text-xs font-medium 
                  border border-transparent ${colors[value]}`}
    >
      {STATUS_OPTIONS.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  );
};

export default StatusSelect
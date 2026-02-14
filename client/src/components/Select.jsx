import React from "react";

const Select = ({ label, value, onChange, options }) => (
  <div>
    <label className="block text-sm mb-1">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-slate-300 
                 dark:border-slate-700 
                 bg-transparent rounded-lg px-3 py-2"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

export default Select
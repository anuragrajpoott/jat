import React from "react";

export const Input = React.forwardRef(
  ({ label, ...props }, ref) => (
    <div>
      <label className="block text-sm 
                        text-slate-500 dark:text-slate-400 mb-1">
        {label}
      </label>
      <input
        ref={ref}
        {...props}
        className="modal-input"
      />
    </div>
  )
);

export const Select = ({ label, options, ...props }) => (
  <div>
    <label className="block text-sm 
                      text-slate-500 dark:text-slate-400 mb-1">
      {label}
    </label>
    <select
      {...props}
      className="modal-input"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);
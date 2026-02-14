import { useEffect, useRef, useState } from "react";
import { createJob } from "../apis/jobs";
import React from "react";

const STATUS_OPTIONS = [
  "applied",
  "shortlisted",
  "interview",
  "offer",
  "rejected",
];

const PRIORITY_OPTIONS = ["low", "medium", "high"];

const AddJobForm = ({ setJobs, closeModal }) => {
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const companyRef = useRef(null);

  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    company: "",
    role: "",
    status: "applied",
    priority: "medium",
    ctc: "",
    source: "",
    referred: false,
    resume: "",
    appliedDate: today,
    followUpDate: "",
    notes: "",
  });

  useEffect(() => {
    companyRef.current?.focus();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.company || !formData.role) return;

    try {
      setLoading(true);

      const res = await createJob(formData);
      setJobs((prev) => [res.data, ...prev]);

      closeModal(); // 👈 Close after success
    } catch (error) {
      console.error("Create failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      <h2 className="text-2xl font-serif text-slate-100">
        Add Application
      </h2>

      {/* Core Fields */}
      <div className="space-y-4">

        <Input
          ref={companyRef}
          label="Company"
          name="company"
          value={formData.company}
          onChange={handleChange}
          required
        />

        <Input
          label="Role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={STATUS_OPTIONS}
          />

          <Input
            type="date"
            label="Applied Date"
            name="appliedDate"
            value={formData.appliedDate}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Advanced Toggle */}
      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="text-sm text-slate-400 hover:text-slate-200 transition"
      >
        {showAdvanced ? "Hide details" : "More options"}
      </button>

      {showAdvanced && (
        <div className="space-y-4 pt-4 border-t border-slate-800">

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              options={PRIORITY_OPTIONS}
            />

            <Input
              type="number"
              label="CTC"
              name="ctc"
              value={formData.ctc}
              onChange={handleChange}
            />
          </div>

          <Input
            label="Source"
            name="source"
            value={formData.source}
            onChange={handleChange}
          />

          <Input
            label="Resume URL"
            name="resume"
            value={formData.resume}
            onChange={handleChange}
          />

          <Input
            type="date"
            label="Follow Up Date"
            name="followUpDate"
            value={formData.followUpDate}
            onChange={handleChange}
          />

          <div>
            <label className="block text-sm text-slate-400 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              rows="3"
              value={formData.notes}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 
                         rounded-lg px-3 py-2 outline-none 
                         focus:ring-1 focus:ring-slate-500"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-400">
            <input
              type="checkbox"
              name="referred"
              checked={formData.referred}
              onChange={handleChange}
            />
            Referred
          </label>

        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-4 pt-4 border-t border-slate-800">
        <button
          type="button"
          onClick={closeModal}
          className="text-slate-400 hover:text-slate-200 transition"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="bg-slate-200 text-slate-900 px-6 py-2 
                     rounded-full font-medium 
                     hover:bg-white transition 
                     disabled:opacity-50"
        >
          {loading ? "Adding..." : "Save"}
        </button>
      </div>
    </form>
  );
};

export default AddJobForm


const Input = React.forwardRef(
  ({ label, ...props }, ref) => (
    <div>
      <label className="block text-sm text-slate-400 mb-1">
        {label}
      </label>
      <input
        ref={ref}
        {...props}
        className="w-full bg-slate-800 border border-slate-700 
                   rounded-lg px-3 py-2 outline-none 
                   focus:ring-1 focus:ring-slate-500"
      />
    </div>
  )
);

const Select = ({ label, options, ...props }) => (
  <div>
    <label className="block text-sm text-slate-400 mb-1">
      {label}
    </label>
    <select
      {...props}
      className="w-full bg-slate-800 border border-slate-700 
                 rounded-lg px-3 py-2 outline-none 
                 focus:ring-1 focus:ring-slate-500"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

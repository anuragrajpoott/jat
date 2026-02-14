import { useEffect, useRef, useState } from "react";
import { createJob } from "../apis/jobs";
import React from "react";
import { Input, Select } from "./Input";

const STATUS_OPTIONS = [
  "saved",
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

      const cleanedData = {
        ...formData,
        ctc: formData.ctc ? Number(formData.ctc) : undefined,
        followUpDate: formData.followUpDate || undefined,
        resume: formData.resume || undefined,
        source: formData.source || undefined,
        notes: formData.notes || undefined,
      };

      const res = await createJob(cleanedData);
      setJobs((prev) => [res.data, ...prev]);

      closeModal();
    } catch (error) {
      console.error("Create failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Title */}
      <div>
        <h2 className="text-3xl font-serif 
                       text-slate-800 dark:text-slate-200">
          Add Application
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Quickly log your new opportunity.
        </p>
      </div>

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
        className="text-sm text-slate-500 dark:text-slate-400
                   hover:text-slate-800 dark:hover:text-slate-200 transition"
      >
        {showAdvanced ? "Hide details" : "More options"}
      </button>

      {showAdvanced && (
        <div className="space-y-4 pt-4 
                        border-t border-[#e5caca] dark:border-slate-800">

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
            <label className="block text-sm 
                              text-slate-500 dark:text-slate-400 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              rows="3"
              value={formData.notes}
              onChange={handleChange}
              className="modal-textarea"
            />
          </div>

          <label className="flex items-center gap-2 
                            text-sm text-slate-500 dark:text-slate-400">
            <input
              type="checkbox"
              name="referred"
              checked={formData.referred}
              onChange={handleChange}
              className="accent-slate-600 dark:accent-slate-300"
            />
            Referred
          </label>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-4 pt-4 
                      border-t border-[#e5caca] dark:border-slate-800">

        <button
          type="button"
          onClick={closeModal}
          className="text-slate-500 dark:text-slate-400
                     hover:text-slate-800 dark:hover:text-slate-200 transition"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="bg-slate-800 text-white 
                     dark:bg-white dark:text-slate-900
                     px-6 py-2 rounded-full font-medium
                     hover:opacity-90 transition 
                     disabled:opacity-50"
        >
          {loading ? "Adding..." : "Save"}
        </button>
      </div>
    </form>
  );
};

export default AddJobForm;





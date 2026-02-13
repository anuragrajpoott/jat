import { useState, useEffect } from "react";
import { createJob } from "../../apis/jobs";
import { STATUS_COLUMNS } from "../../constants/statusColumns";
import React from "react";

const AddJobModal = ({ setShowModal, setJobs }) => {
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    status: "saved",
    priority: "medium",
    location: "",
    jobUrl: "",
    followUpDate: "",
    notes: "",
  });

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setShowModal(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [setShowModal]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      appliedDate:
        formData.status === "applied"
          ? new Date()
          : undefined,
    };

    const { data } = await createJob(payload);

    setJobs((prev) => [data, ...prev]);
    setShowModal(false);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={() => setShowModal(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900 border border-slate-800 rounded-2xl w-180 p-6 shadow-2xl"
      >
        <h2 className="text-xl font-semibold mb-6">
          Add Application
        </h2>

        <form
  onSubmit={handleSubmit}
  className="flex flex-col gap-6"
>
  <div className="grid grid-cols-2 gap-6">

    {/* LEFT COLUMN */}
    <div className="flex flex-col gap-4">

      <div>
        <label className="block text-sm text-slate-400 mb-1">
          Company
        </label>
        <input
          name="company"
          required
          value={formData.company}
          onChange={handleChange}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm text-slate-400 mb-1">
          Role
        </label>
        <input
          name="role"
          required
          value={formData.role}
          onChange={handleChange}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm text-slate-400 mb-1">
          Location
        </label>
        <input
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm text-slate-400 mb-1">
          Job URL
        </label>
        <input
          name="jobUrl"
          value={formData.jobUrl}
          onChange={handleChange}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2"
        />
      </div>

    </div>

    {/* RIGHT COLUMN */}
    <div className="flex flex-col gap-4">

      <div>
        <label className="block text-sm text-slate-400 mb-1">
          Status
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2"
        >
          {STATUS_COLUMNS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm text-slate-400 mb-1">
          Priority
        </label>
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div>
        <label className="block text-sm text-slate-400 mb-1">
          Follow Up Date
        </label>
        <input
          type="date"
          name="followUpDate"
          value={formData.followUpDate}
          onChange={handleChange}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2"
        />
      </div>

    </div>

  </div>

  {/* NOTES FULL WIDTH */}
  <div>
    <label className="block text-sm text-slate-400 mb-1">
      Notes
    </label>
    <textarea
      name="notes"
      rows="3"
      value={formData.notes}
      onChange={handleChange}
      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 resize-none"
    />
  </div>

  {/* ACTIONS */}
  <div className="flex justify-end gap-3">
    <button
      type="button"
      onClick={() => setShowModal(false)}
      className="px-4 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 transition"
    >
      Cancel
    </button>

    <button
      type="submit"
      className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition font-medium"
    >
      Save Application
    </button>
  </div>
</form>

      </div>
    </div>
  );
};

export default AddJobModal;

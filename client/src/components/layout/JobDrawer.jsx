import { useState, useEffect } from "react";
import { updateJob, deleteJob } from "../../apis/jobs";
import { STATUS_COLUMNS } from "../../constants/statusColumns";
import React from "react";

const JobDrawer = ({ job, onClose, setJobs }) => {

    const [isOpen, setIsOpen] = useState(false);

useEffect(() => {
  setIsOpen(true);
}, []);

  const [formData, setFormData] = useState(job);

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setIsOpen(false);
setTimeout(onClose, 200);
;
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    const { data } = await updateJob(job._id, formData);

    setJobs((prev) =>
      prev.map((j) => (j._id === job._id ? data : j))
    );

    setIsOpen(false);
setTimeout(onClose, 200);

  };

  const handleDelete = async () => {
    await deleteJob(job._id);

    setJobs((prev) =>
      prev.filter((j) => j._id !== job._id)
    );

    setIsOpen(false);
setTimeout(onClose, 200);
;
  };

  return (
    <div
  className={`fixed inset-0 backdrop-blur-sm bg-black/40 flex justify-end z-50 transition-opacity duration-300 ${
    isOpen ? "opacity-100" : "opacity-0"
  }`}
  onClick={() => {
    setIsOpen(false);
    setTimeout(onClose, 200);
  }}
>

      <div
  onClick={(e) => e.stopPropagation()}
  className={`w-130 h-full bg-slate-900 border-l border-slate-800 shadow-2xl p-6 overflow-y-auto transform transition-transform duration-300 ease-out ${
    isOpen ? "translate-x-0" : "translate-x-full"
  }`}
>

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            Application Details
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Company & Role */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="text-sm text-slate-400 block mb-1">
              Company
            </label>
            <input
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-slate-400 block mb-1">
              Role
            </label>
            <input
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2"
            />
          </div>
        </div>

        {/* Status & Priority Row */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-sm text-slate-400 block mb-1">
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
            <label className="text-sm text-slate-400 block mb-1">
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
        </div>

        {/* Meta Section */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="text-sm text-slate-400 block mb-1">
              Location
            </label>
            <input
              name="location"
              value={formData.location || ""}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm text-slate-400 block mb-1">
              Job URL
            </label>
            <input
              name="jobUrl"
              value={formData.jobUrl || ""}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm text-slate-400 block mb-1">
              Follow Up Date
            </label>
            <input
              type="date"
              name="followUpDate"
              value={
                formData.followUpDate
                  ? formData.followUpDate.slice(0, 10)
                  : ""
              }
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2"
            />
          </div>
        </div>

        {/* Notes */}
        <div className="mb-6">
          <label className="text-sm text-slate-400 block mb-1">
            Notes
          </label>
          <textarea
            name="notes"
            rows="4"
            value={formData.notes || ""}
            onChange={handleChange}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 resize-none"
          />
        </div>

        {/* Activity Timeline */}
<div className="mb-8">
  <h3 className="text-sm text-slate-400 mb-3">
    Activity
  </h3>

  <div className="space-y-3">
    {formData.activity && formData.activity.length > 0 ? (
      formData.activity
        .slice()
        .reverse()
        .map((item, index) => (
          <div
            key={index}
            className="bg-slate-800 border border-slate-700 rounded-lg p-3"
          >
            <div className="text-sm text-slate-300">
              {item.message}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {new Date(item.date).toLocaleString()}
            </div>
          </div>
        ))
    ) : (
      <div className="text-xs text-slate-500">
        No activity yet
      </div>
    )}
  </div>
</div>


        {/* Actions */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-800">
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-400"
          >
            Delete Application
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition font-medium"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDrawer;

import React, { useState, useEffect } from "react";
import { updateJob, deleteJob } from "../../apis/jobs";
import { STATUS_COLUMNS } from "../../constants/statusColumns";

const JobDrawer = ({ job, onClose, setJobs }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(job);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsOpen(true);
  }, []);

  // Sync if job changes
  useEffect(() => {
    setFormData(job);
  }, [job]);

  const closeDrawer = () => {
    setIsOpen(false);
    setTimeout(onClose, 200);
  };

  // ESC Close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") closeDrawer();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const { data } = await updateJob(job._id, formData);

      setJobs((prev) =>
        prev.map((j) => (j._id === job._id ? data : j))
      );

      closeDrawer();
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteJob(job._id);

      setJobs((prev) =>
        prev.filter((j) => j._id !== job._id)
      );

      closeDrawer();
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 backdrop-blur-sm bg-black/40 flex justify-end z-50 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
      onClick={closeDrawer}
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
            onClick={closeDrawer}
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

        {/* Status & Priority */}
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
              {STATUS_COLUMNS.map((column) => (
                <option key={column.key} value={column.key}>
                  {column.label}
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

        {/* Activity Timeline */}
        <div className="mb-8">
          <h3 className="text-sm text-slate-400 mb-3">
            Activity
          </h3>

          <div className="space-y-3">
            {formData.activity?.length ? (
              [...formData.activity]
                .reverse()
                .map((item) => (
                  <div
                    key={`${item.date}-${item.message}`}
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
            disabled={loading}
            className="text-red-500 hover:text-red-400 disabled:opacity-50"
          >
            Delete Application
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition font-medium disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDrawer;

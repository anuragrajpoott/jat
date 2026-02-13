import React, { useState, useEffect } from "react";
import { createJob } from "../../apis/jobs";
import { STATUS_COLUMNS } from "../../constants/statusColumns";

const AddJobModal = ({ setShowModal, setJobs }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    setIsOpen(true);
  }, []);

  const closeModal = () => {
    setIsOpen(false);
    setTimeout(() => setShowModal(false), 200);
  };

  // ESC Close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        ...formData,
        appliedDate:
          formData.status === "applied"
            ? new Date()
            : undefined,
      };

      const { data } = await createJob(payload);

      setJobs((prev) => [data, ...prev]);

      closeModal();
    } catch (error) {
      console.error("Create failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
      onClick={closeModal}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-slate-900 border border-slate-800 rounded-2xl w-180 p-6 shadow-2xl transform transition-all duration-300 ${
          isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
      >
        <h2 className="text-xl font-semibold mb-6">
          Add Application
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-6">
            {/* LEFT COLUMN */}
            <div className="flex flex-col gap-4">
              <Input
                label="Company"
                name="company"
                required
                value={formData.company}
                onChange={handleChange}
              />

              <Input
                label="Role"
                name="role"
                required
                value={formData.role}
                onChange={handleChange}
              />

              <Input
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
              />

              <Input
                label="Job URL"
                name="jobUrl"
                value={formData.jobUrl}
                onChange={handleChange}
              />
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
                  {STATUS_COLUMNS.map((column) => (
                    <option
                      key={column.key}
                      value={column.key}
                    >
                      {column.label}
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

              <Input
                label="Follow Up Date"
                name="followUpDate"
                type="date"
                value={formData.followUpDate}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* NOTES */}
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
              onClick={closeModal}
              className="px-4 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition font-medium disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Reusable Input Component
const Input = ({
  label,
  name,
  value,
  onChange,
  required,
  type = "text",
}) => (
  <div>
    <label className="block text-sm text-slate-400 mb-1">
      {label}
    </label>
    <input
      type={type}
      name={name}
      required={required}
      value={value}
      onChange={onChange}
      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
    />
  </div>
);

export default AddJobModal;

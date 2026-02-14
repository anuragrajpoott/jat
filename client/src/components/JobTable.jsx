import { updateJob, deleteJob } from "../apis/jobs";
import React from "react";

const STATUS_OPTIONS = [
  "saved",
  "applied",
  "shortlisted",
  "interview",
  "offer",
  "rejected",
];

const PRIORITY_OPTIONS = ["low", "medium", "high"];

const JobTable = ({ jobs, setJobs }) => {
  const handleUpdate = async (id, field, value) => {
    try {
      const res = await updateJob(id, { [field]: value });

      setJobs((prev) =>
        prev.map((job) =>
          job._id === id ? res.data : job
        )
      );
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this job?")) return;

    try {
      await deleteJob(id);
      setJobs((prev) =>
        prev.filter((job) => job._id !== id)
      );
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const isStale = (job) => {
    if (!job.appliedDate || job.status !== "applied") return false;
    const days =
      (new Date() - new Date(job.appliedDate)) /
      (1000 * 60 * 60 * 24);
    return days > 14;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
      <table className="w-full text-sm">

        <thead className="bg-slate-950 text-slate-400 uppercase tracking-wide text-xs">
          <tr>
            <th className="px-4 py-3 text-left">Company</th>
            <th className="px-4 py-3 text-left">Role</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Priority</th>
            <th className="px-4 py-3 text-left">CTC</th>
            <th className="px-4 py-3 text-left">Source</th>
            <th className="px-4 py-3 text-left">Referred</th>
            <th className="px-4 py-3 text-left">Applied</th>
            <th className="px-4 py-3 text-left">Follow Up</th>
            <th className="px-4 py-3 text-left">Resume</th>
            <th className="px-4 py-3 text-left">Notes</th>
            <th className="px-4 py-3 text-left"></th>
          </tr>
        </thead>

        <tbody>
          {jobs.length === 0 ? (
            <tr>
              <td colSpan="12" className="text-center py-10 text-slate-500">
                No applications yet
              </td>
            </tr>
          ) : (
            jobs.map((job) => (
              <tr
                key={job._id}
                className={`border-t border-slate-800 hover:bg-slate-950/60 transition ${
                  isStale(job) ? "bg-yellow-500/5" : ""
                }`}
              >
                {/* Company */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {isStale(job) && (
                      <span className="w-2 h-2 bg-yellow-400 rounded-full" />
                    )}
                    <input
                      defaultValue={job.company}
                      onBlur={(e) =>
                        handleUpdate(job._id, "company", e.target.value)
                      }
                      className="table-input"
                    />
                  </div>
                </td>

                {/* Role */}
                <td className="px-4 py-3">
                  <input
                    defaultValue={job.role}
                    onBlur={(e) =>
                      handleUpdate(job._id, "role", e.target.value)
                    }
                    className="table-input"
                  />
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <StatusSelect
                    value={job.status}
                    onChange={(value) =>
                      handleUpdate(job._id, "status", value)
                    }
                  />
                </td>

                {/* Priority */}
                <td className="px-4 py-3">
                  <select
                    value={job.priority}
                    onChange={(e) =>
                      handleUpdate(job._id, "priority", e.target.value)
                    }
                    className="table-select"
                  >
                    {PRIORITY_OPTIONS.map((priority) => (
                      <option key={priority} value={priority}>
                        {priority}
                      </option>
                    ))}
                  </select>
                </td>

                {/* CTC */}
                <td className="px-4 py-3">
                  <input
                    type="number"
                    defaultValue={job.ctc || ""}
                    onBlur={(e) =>
                      handleUpdate(job._id, "ctc", e.target.value)
                    }
                    className="table-input"
                  />
                </td>

                {/* Source */}
                <td className="px-4 py-3">
                  <input
                    defaultValue={job.source || ""}
                    onBlur={(e) =>
                      handleUpdate(job._id, "source", e.target.value)
                    }
                    className="table-input"
                  />
                </td>

                {/* Referred */}
                <td className="px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={job.referred || false}
                    onChange={(e) =>
                      handleUpdate(job._id, "referred", e.target.checked)
                    }
                    className="accent-slate-400"
                  />
                </td>

                {/* Applied */}
                <td className="px-4 py-3">
                  <input
                    type="date"
                    value={
                      job.appliedDate
                        ? job.appliedDate.split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      handleUpdate(job._id, "appliedDate", e.target.value)
                    }
                    className="table-select"
                  />
                </td>

                {/* Follow Up */}
                <td className="px-4 py-3">
                  <input
                    type="date"
                    value={
                      job.followUpDate
                        ? job.followUpDate.split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      handleUpdate(job._id, "followUpDate", e.target.value)
                    }
                    className="table-select"
                  />
                </td>

                {/* Resume */}
                <td className="px-4 py-3">
                  <input
                    defaultValue={job.resume || ""}
                    placeholder="URL"
                    onBlur={(e) =>
                      handleUpdate(job._id, "resume", e.target.value)
                    }
                    className="table-input"
                  />
                </td>

                {/* Notes */}
                <td className="px-4 py-3">
                  <input
                    defaultValue={job.notes || ""}
                    onBlur={(e) =>
                      handleUpdate(job._id, "notes", e.target.value)
                    }
                    className="table-input"
                  />
                </td>

                {/* Delete */}
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleDelete(job._id)}
                    className="text-slate-500 hover:text-red-400 transition"
                  >
                    ✕
                  </button>
                </td>

              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

const StatusSelect = ({ value, onChange }) => {
  const colors = {
    saved: "bg-gray-200 text-gray-800",
    applied: "bg-blue-100 text-blue-800",
    shortlisted: "bg-indigo-100 text-indigo-800",
    interview: "bg-purple-100 text-purple-800",
    offer: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-700",
  };

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`rounded-full px-3 py-1 text-xs font-medium ${colors[value]}`}
    >
      {STATUS_OPTIONS.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  );
};

export default JobTable;

import { updateJob, deleteJob } from "../apis/jobs";
import React from "react";
import StatusSelect from "../components/StatusSelect"

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
    let cleanedValue = value;

    // Clean number
    if (field === "ctc") {
      cleanedValue = value ? Number(value) : undefined;
    }

    // Clean dates
    if (field === "appliedDate" || field === "followUpDate") {
      cleanedValue = value || undefined;
    }

    // Clean empty strings
    if (value === "") {
      cleanedValue = undefined;
    }

    const res = await updateJob(id, { [field]: cleanedValue });


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
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">

        {/* Header */}
        <thead className="sticky top-0 z-10 
                           bg-[#f0dada] dark:bg-slate-900
                           text-slate-600 dark:text-slate-400
                           uppercase tracking-wide text-xs">
          <tr>
            {[
              "Company", "Role", "Status", "Priority", "CTC",
              "Source", "Referred", "Applied", "Follow Up",
              "Resume", "Notes", ""
            ].map((col) => (
              <th key={col} className="px-4 py-3 text-left whitespace-nowrap">
                {col}
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {jobs.length === 0 ? (
            <tr>
              <td colSpan="12" className="text-center py-16">
                <div className="flex flex-col items-center gap-3 text-slate-500 dark:text-slate-400">
                  <p className="text-lg font-medium">
                    No applications yet
                  </p>
                  <p className="text-sm">
                    Click “Add” to start tracking your job hunt.
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            jobs.map((job) => (
              <tr
                key={job._id}
                className={`border-t border-[#e5caca] dark:border-slate-800
                            hover:bg-[#faf3f3] dark:hover:bg-slate-900/60
                            transition ${
                  isStale(job)
                    ? "bg-yellow-100/40 dark:bg-yellow-500/10"
                    : ""
                }`}
              >
                {/* Company */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {isStale(job) && (
                      <span className="w-2 h-2 bg-yellow-500 rounded-full" />
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
                <td className="px-4 py-3 whitespace-nowrap">
                  <input
                    defaultValue={job.role}
                    onBlur={(e) =>
                      handleUpdate(job._id, "role", e.target.value)
                    }
                    className="table-input"
                  />
                </td>

                {/* Status */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <StatusSelect
                    value={job.status}
                    onChange={(value) =>
                      handleUpdate(job._id, "status", value)
                    }
                  />
                </td>

                {/* Priority */}
                <td className="px-4 py-3 whitespace-nowrap">
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
                <td className="px-4 py-3 whitespace-nowrap">
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
                <td className="px-4 py-3 whitespace-nowrap">
                  <input
                    defaultValue={job.source || ""}
                    onBlur={(e) =>
                      handleUpdate(job._id, "source", e.target.value)
                    }
                    className="table-input"
                  />
                </td>

                {/* Referred */}
                <td className="px-4 py-3 text-center whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={job.referred || false}
                    onChange={(e) =>
                      handleUpdate(job._id, "referred", e.target.checked)
                    }
                    className="accent-slate-500"
                  />
                </td>

                {/* Applied */}
                <td className="px-4 py-3 whitespace-nowrap">
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
                <td className="px-4 py-3 whitespace-nowrap">
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
                <td className="px-4 py-3 whitespace-nowrap">
                  <input
                    defaultValue={job.resume || ""}
                    onBlur={(e) =>
                      handleUpdate(job._id, "resume", e.target.value)
                    }
                    className="table-input"
                  />
                </td>

                {/* Notes */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <input
                    defaultValue={job.notes || ""}
                    onBlur={(e) =>
                      handleUpdate(job._id, "notes", e.target.value)
                    }
                    className="table-input"
                  />
                </td>

                {/* Delete */}
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <button
                    onClick={() => handleDelete(job._id)}
                    className="text-slate-500 hover:text-red-500 transition"
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



export default JobTable;

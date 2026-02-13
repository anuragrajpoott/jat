import React from "react";
import { STATUS_COLUMNS } from "../../constants/statusColumns";

const statusColorMap = {
  saved: "bg-gray-600",
  applied: "bg-blue-600",
  screening: "bg-purple-600",
  interview: "bg-indigo-600",
  final: "bg-yellow-600",
  offer: "bg-green-600",
  rejected: "bg-red-600",
  ghosted: "bg-slate-600",
};

const JobTable = ({ jobs, setSelectedJob }) => {
  return (
    <div className="px-6 py-6">
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-sm">
          <thead className="bg-slate-900 border-b border-slate-800 sticky top-0">
            <tr className="text-left text-slate-400">
              <th className="px-4 py-3 font-medium">Company</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Priority</th>
              <th className="px-4 py-3 font-medium">Follow Up</th>
            </tr>
          </thead>

          <tbody>
            {jobs.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-8 text-slate-500"
                >
                  No applications found
                </td>
              </tr>
            ) : (
              jobs.map((job) => {
                const isOverdue =
                  job.followUpDate &&
                  new Date(job.followUpDate) <= new Date();

                return (
                  <tr
                    key={job._id}
                    onClick={() => setSelectedJob(job)}
                    className="border-b border-slate-800 hover:bg-slate-900 cursor-pointer transition"
                  >
                    <td className="px-4 py-3 text-white font-medium">
                      {job.company}
                    </td>

                    <td className="px-4 py-3 text-slate-400">
                      {job.role}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full text-white ${
                          statusColorMap[job.status]
                        }`}
                      >
                        {job.status}
                      </span>
                    </td>

                    <td className="px-4 py-3 capitalize text-slate-300">
                      {job.priority}
                    </td>

                    <td
                      className={`px-4 py-3 ${
                        isOverdue
                          ? "text-red-400 font-medium"
                          : "text-slate-400"
                      }`}
                    >
                      {job.followUpDate
                        ? new Date(
                            job.followUpDate
                          ).toLocaleDateString()
                        : "-"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JobTable;

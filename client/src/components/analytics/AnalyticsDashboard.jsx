import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { STATUS_COLUMNS } from "../../constants/statusColumns";

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#ef4444",
  "#8b5cf6",
  "#f59e0b",
  "#14b8a6",
  "#e11d48",
  "#64748b",
];

const AnalyticsDashboard = ({ jobs }) => {
  const data = useMemo(() => {
    const counts = {};

    // Initialize all statuses to 0
    STATUS_COLUMNS.forEach((column) => {
      counts[column.key] = 0;
    });

    // Count actual jobs
    jobs.forEach((job) => {
      if (counts[job.status] !== undefined) {
        counts[job.status]++;
      }
    });

    return STATUS_COLUMNS.map((column) => ({
      name: column.label,
      value: counts[column.key],
    }));
  }, [jobs]);

  const total = jobs.length;

  if (!total) {
    return (
      <div className="p-6 text-slate-400">
        No analytics available yet.
      </div>
    );
  }

  return (
    <div className="p-6 h-125">
      <h2 className="text-lg font-semibold mb-4">
        Applications by Status
      </h2>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            outerRadius={150}
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid #334155",
              borderRadius: "8px",
            }}
          />

          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalyticsDashboard;

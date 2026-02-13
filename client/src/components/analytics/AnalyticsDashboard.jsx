import React from "react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#ef4444",
  "#8b5cf6",
  "#f59e0b",
];

const AnalyticsDashboard = ({ jobs }) => {
  const statusCounts = {};

  jobs.forEach((job) => {
    statusCounts[job.status] =
      (statusCounts[job.status] || 0) + 1;
  });

  const data = Object.keys(statusCounts).map(
    (status) => ({
      name: status,
      value: statusCounts[status],
    })
  );

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
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalyticsDashboard;

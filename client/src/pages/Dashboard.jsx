import React, { useState, useEffect, useMemo } from "react";
import { fetchJobs } from "../apis/jobs";

import KanbanBoard from "../components/kanban/KanbanBoard";
import AddJobModal from "../components/modals/AddJobModal";
import JobDrawer from "../components/layout/JobDrawer";
import StatCard from "../components/layout/StatsCard";
import JobTable from "../components/table/JobTable";
import AnalyticsDashboard from "../components/analytics/AnalyticsDashboard";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("board"); // board | analytics
  const [viewMode, setViewMode] = useState("kanban"); // kanban | table

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  // -----------------------------
  // Debounce search
  // -----------------------------
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(handler);
  }, [search]);

  // -----------------------------
  // Load Jobs
  // -----------------------------
  const loadJobs = async () => {
    try {
      setLoading(true);
      const { data } = await fetchJobs();
      setJobs(data.jobs); // important for paginated backend
    } catch (error) {
      console.error("Failed to load jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  // -----------------------------
  // Filtered Jobs
  // -----------------------------
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.company
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase()) ||
        job.role
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase());

      const matchesPriority =
        priorityFilter === "all" ||
        job.priority === priorityFilter;

      return matchesSearch && matchesPriority;
    });
  }, [jobs, debouncedSearch, priorityFilter]);

  // -----------------------------
  // Stats Calculation
  // -----------------------------
  const stats = useMemo(() => {
    const total = jobs.length;

    const appliedCount = jobs.filter(
      (job) => job.status === "applied"
    ).length;

    const interviewCount = jobs.filter((job) =>
      ["interview", "final", "screening"].includes(job.status)
    ).length;

    const offerCount = jobs.filter(
      (job) => job.status === "offer"
    ).length;

    const rejectedCount = jobs.filter((job) =>
      ["rejected", "ghosted"].includes(job.status)
    ).length;

    const responseRate =
      appliedCount > 0
        ? ((interviewCount / appliedCount) * 100).toFixed(0)
        : 0;

    return {
      total,
      appliedCount,
      interviewCount,
      offerCount,
      rejectedCount,
      responseRate,
    };
  }, [jobs]);

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <div className="h-screen flex flex-col bg-slate-950 text-slate-200">

      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800 bg-slate-900">
        <h1 className="text-2xl font-semibold tracking-tight">
          My Applications
        </h1>

        <div className="flex gap-3 items-center">

          {/* Search */}
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-800 border border-slate-700 px-4 py-2 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 px-3 py-2 rounded-lg"
          >
            <option value="all">All</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* View Switch */}
          <div className="flex bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
            <button
              onClick={() => setViewMode("kanban")}
              className={`px-3 py-2 text-sm ${
                viewMode === "kanban"
                  ? "bg-slate-700 text-white"
                  : "text-slate-400"
              }`}
            >
              Kanban
            </button>

            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-2 text-sm ${
                viewMode === "table"
                  ? "bg-slate-700 text-white"
                  : "text-slate-400"
              }`}
            >
              Table
            </button>
          </div>

          {/* Add Button */}
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg font-medium transition"
          >
            + Add
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 px-6 pt-4">
        <button
          onClick={() => setActiveTab("board")}
          className={`pb-2 border-b-2 ${
            activeTab === "board"
              ? "border-blue-500 text-white"
              : "border-transparent text-slate-400"
          }`}
        >
          Board
        </button>

        <button
          onClick={() => setActiveTab("analytics")}
          className={`pb-2 border-b-2 ${
            activeTab === "analytics"
              ? "border-blue-500 text-white"
              : "border-transparent text-slate-400"
          }`}
        >
          Analytics
        </button>
      </div>

      {/* Stats */}
      <div className="px-6 py-4 bg-slate-900 border-b border-slate-800">
        <div className="grid grid-cols-6 gap-4">
          <StatCard label="Total" value={stats.total} />
          <StatCard label="Applied" value={stats.appliedCount} />
          <StatCard label="Interviews" value={stats.interviewCount} />
          <StatCard label="Offers" value={stats.offerCount} highlight="green" />
          <StatCard label="Rejected" value={stats.rejectedCount} highlight="red" />
          <StatCard
            label="Response %"
            value={`${stats.responseRate}%`}
            highlight="blue"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">

        {loading ? (
          <div className="flex justify-center items-center h-full text-slate-400">
            Loading jobs...
          </div>
        ) : activeTab === "board" ? (
          viewMode === "kanban" ? (
            <KanbanBoard
              jobs={filteredJobs}
              setJobs={setJobs}
              setSelectedJob={setSelectedJob}
            />
          ) : (
            <JobTable
              jobs={filteredJobs}
              setSelectedJob={setSelectedJob}
            />
          )
        ) : (
          <AnalyticsDashboard jobs={jobs} />
        )}
      </div>

      {/* Drawer */}
      {selectedJob && (
        <JobDrawer
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          setJobs={setJobs}
        />
      )}

      {/* Modal */}
      {showModal && (
        <AddJobModal
          setShowModal={setShowModal}
          setJobs={setJobs}
        />
      )}
    </div>
  );
};

export default Dashboard;

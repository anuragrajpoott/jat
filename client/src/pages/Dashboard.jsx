import { useState, useEffect } from "react";
import { fetchJobs } from "../apis/jobs";
import KanbanBoard from "../components/kanban/KanbanBoard";
import AddJobModal from "../components/modals/AddJobModal";
import JobDrawer from "../components/layout/JobDrawer";
import StatCard from "../components/layout/StatsCard";
import JobTable from "../components/table/JobTable";
import AnalyticsDashboard from "../components/analytics/AnalyticsDashboard";



import React from "react";

const Dashboard = () => {

    const [activeTab, setActiveTab] = useState("board"); 
// "board" | "analytics"


    const [viewMode, setViewMode] = useState("kanban"); 



    const [search, setSearch] = useState("");
const [priorityFilter, setPriorityFilter] = useState("all");


  const [jobs, setJobs] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [selectedJob, setSelectedJob] = useState(null);


  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    const { data } = await fetchJobs();
    setJobs(data);
  };

  const filteredJobs = jobs.filter((job) => {
  const matchesSearch =
    job.company.toLowerCase().includes(search.toLowerCase()) ||
    job.role.toLowerCase().includes(search.toLowerCase());

  const matchesPriority =
    priorityFilter === "all" || job.priority === priorityFilter;

  return matchesSearch && matchesPriority;
});

const total = jobs.length;

const appliedCount = jobs.filter(
  (job) => job.status === "applied"
).length;

const interviewCount = jobs.filter(
  (job) =>
    job.status === "interview" ||
    job.status === "final" ||
    job.status === "screening"
).length;

const offerCount = jobs.filter(
  (job) => job.status === "offer"
).length;

const rejectedCount = jobs.filter(
  (job) =>
    job.status === "rejected" ||
    job.status === "ghosted"
).length;

const responseRate =
  appliedCount > 0
    ? ((interviewCount / appliedCount) * 100).toFixed(0)
    : 0;



  return (
    <div className="h-screen  flex flex-col bg-slate-950 text-slate-200">
      {/* Header */}
    <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800 bg-slate-900">
  <h1 className="text-2xl font-semibold tracking-tight">
    My Applications
  </h1>

  <div className="flex gap-3 items-center">
    <input
      type="text"
      placeholder="Search..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="bg-slate-800 border border-slate-700 px-4 py-2 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

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


    <button
      onClick={() => setShowModal(true)}
      className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg font-medium transition"
    >
      + Add
    </button>
  </div>
</div>

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


<div className="px-6 py-4 bg-slate-900 border-b border-slate-800">
  <div className="grid grid-cols-6 gap-4">

    <StatCard label="Total" value={total} />
    <StatCard label="Applied" value={appliedCount} />
    <StatCard label="Interviews" value={interviewCount} />
    <StatCard label="Offers" value={offerCount} highlight="green" />
    <StatCard label="Rejected" value={rejectedCount} highlight="red" />
    <StatCard label="Response %" value={responseRate + "%"} highlight="blue" />

  </div>
</div>




  {activeTab === "board" ? (
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




{selectedJob && (
  <JobDrawer
    job={selectedJob}
    onClose={() => setSelectedJob(null)}
    setJobs={setJobs}
  />
)}



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

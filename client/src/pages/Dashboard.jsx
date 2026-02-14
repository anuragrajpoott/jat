import { useEffect, useMemo, useState, useContext } from "react";
import { fetchJobs } from "../apis/jobs";
import AddJobForm from "../components/AddJobForm";
import JobTable from "../components/JobTable";
import { ThemeContext } from "../context/ThemeContext";
import React from "react";
import Select from "../components/Select";
import Modal from "../components/Modal";
import StatCard from "../components/StatCard";

const Dashboard = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("-createdAt");

  const loadJobs = async () => {
    try {
      setLoading(true);

      const query = new URLSearchParams({
        status: statusFilter,
        priority: priorityFilter,
        search,
        sort,
      }).toString();

      const res = await fetchJobs(query);
      setJobs(res.data);
    } catch (error) {
      console.error("Failed to load jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [statusFilter, priorityFilter, search, sort]);

  const stats = useMemo(() => {
    const counts = {
      saved: 0,
      applied: 0,
      interview: 0,
      offer: 0,
      rejected: 0,
    };

    jobs.forEach((job) => {
      if (counts[job.status] !== undefined) {
        counts[job.status]++;
      }
    });

    return counts;
  }, [jobs]);

  return (
    <div className="min-h-screen bg-[#f3e6e6] dark:bg-slate-950 
                    text-slate-800 dark:text-slate-200 
                    transition-colors duration-300">

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex justify-between items-start mb-10">
          <div>
            <h1 className="text-4xl font-serif tracking-wide">
              Job Applications
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Track applications. Stay focused.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="px-4 py-2 rounded-full border 
                         border-slate-300 dark:border-slate-700
                         hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              {theme === "light" ? "Dark" : "Light"}
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2 rounded-full bg-slate-800 
                         text-white dark:bg-white dark:text-slate-900 
                         hover:opacity-90 transition"
            >
              + Add
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        <div className="bg-white dark:bg-slate-900 
                        border border-[#e5caca] dark:border-slate-800 
                        rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-4 gap-4">

            <Select label="Status" value={statusFilter} onChange={setStatusFilter}
              options={["all","saved","applied","shortlisted","interview","offer","rejected"]} />

            <Select label="Priority" value={priorityFilter} onChange={setPriorityFilter}
              options={["all","low","medium","high"]} />

            <div>
              <label className="block text-sm mb-1">Search</label>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Company or role"
                className="w-full border border-slate-300 
                           dark:border-slate-700 
                           bg-transparent rounded-lg px-3 py-2"
              />
            </div>

            <Select label="Sort" value={sort} onChange={setSort}
              options={[
                "-createdAt",
                "-appliedDate",
                "appliedDate"
              ]} />
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          <StatCard label="Saved" value={stats.saved} />
          <StatCard label="Applied" value={stats.applied} />
          <StatCard label="Interview" value={stats.interview} />
          <StatCard label="Offer" value={stats.offer} />
          <StatCard label="Rejected" value={stats.rejected} />
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-slate-900 
                        border border-[#e5caca] dark:border-slate-800 
                        rounded-2xl overflow-hidden">
          {loading ? (
            <p className="p-8 text-center">Loading...</p>
          ) : (
            <JobTable jobs={jobs} setJobs={setJobs} />
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <AddJobForm
            setJobs={setJobs}
            closeModal={() => setIsModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
};



export default Dashboard;

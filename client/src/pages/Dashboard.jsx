import { useEffect, useMemo, useState } from "react";
import { fetchJobs } from "../apis/jobs";
import AddJobForm from "../components/AddJobForm";
import JobTable from "../components/JobTable";
import React from "react";

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const res = await fetchJobs();
      setJobs(res.data);
    } catch (error) {
      console.error("Failed to load jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const stats = useMemo(() => {
    const total = jobs.length;
    const applied = jobs.filter(j => j.status === "applied").length;
    const interview = jobs.filter(j =>
      ["interview", "shortlisted"].includes(j.status)
    ).length;
    const offer = jobs.filter(j => j.status === "offer").length;

    return { total, applied, interview, offer };
  }, [jobs]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 px-8 py-10">

      {/* Header + Add Button */}
      <div className="mb-10 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-serif tracking-wide">
            Job Application Tracker
          </h1>
          <p className="text-slate-400 mt-1">
            Track applications. Stay consistent. Stay focused.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-800 hover:bg-slate-700 border border-slate-700 
                     px-5 py-2 rounded-full text-sm transition"
        >
          + Add Application
        </button>
      </div>

      {/* Mini Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <MiniStat label="Total" value={stats.total} />
        <MiniStat label="Applied" value={stats.applied} />
        <MiniStat label="Interviews" value={stats.interview} />
        <MiniStat label="Offers" value={stats.offer} />
      </div>

      {/* Table */}
      {loading ? (
        <p className="mt-6 text-slate-400">Loading...</p>
      ) : (
        <JobTable jobs={jobs} setJobs={setJobs} />
      )}

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

const MiniStat = ({ label, value }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
    <p className="text-xs text-slate-400 uppercase tracking-wide">
      {label}
    </p>
    <p className="text-xl font-semibold mt-1">
      {value}
    </p>
  </div>
);

/* Modal Component */
const Modal = ({ children, onClose }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm 
                    flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-slate-800 
                      rounded-2xl shadow-xl w-full max-w-lg p-8 
                      animate-fadeIn">
        {children}
      </div>
    </div>
  );
};

export default Dashboard;

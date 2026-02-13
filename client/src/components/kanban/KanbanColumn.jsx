import React from "react";
import { Droppable } from "@hello-pangea/dnd";
import JobCard from "./JobCard";

const KanbanColumn = ({
  status,
  title,
  jobs,
  setSelectedJob,
}) => {
  return (
    <Droppable droppableId={status}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`min-w-70 bg-slate-900 border rounded-xl p-4 flex flex-col transition
            ${
              snapshot.isDraggingOver
                ? "border-blue-500 bg-slate-800"
                : "border-slate-800"
            }`}
        >
          {/* Column Header */}
          <h2 className="font-semibold mb-3 flex justify-between items-center">
            <span>{title}</span>
            <span className="text-sm text-slate-400">
              {jobs.length}
            </span>
          </h2>

          {/* Job Cards */}
          <div className="flex flex-col gap-3 flex-1">
            {jobs.length === 0 && (
              <div className="text-slate-500 text-sm italic py-4 text-center">
                No jobs here
              </div>
            )}

            {jobs.map((job, index) => (
              <JobCard
                key={job._id}
                job={job}
                index={index}
                setSelectedJob={setSelectedJob}
              />
            ))}

            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
};

export default KanbanColumn;

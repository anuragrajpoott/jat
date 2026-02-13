import { Droppable } from "@hello-pangea/dnd";
import JobCard from "./JobCard";
import React from "react";

const KanbanColumn = ({ status, jobs, setSelectedJob }) => {
  return (
    <Droppable droppableId={status}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="min-w-70 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col"

        >
          <h2 className="capitalize font-semibold mb-3">
            {status} ({jobs.length})
          </h2>

          <div className="flex flex-col gap-3 flex-1">
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

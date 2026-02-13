import React from "react";
import { Draggable } from "@hello-pangea/dnd";

const JobCard = ({ job, index, setSelectedJob }) => {
  const priorityColor = {
    low: "bg-green-900 text-green-300",
    medium: "bg-yellow-900 text-yellow-300",
    high: "bg-red-900 text-red-300",
  };

  const isFollowUpDue =
    job.followUpDate &&
    new Date(job.followUpDate) <= new Date();

  return (
    <Draggable draggableId={job._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => {
            if (!snapshot.isDragging) {
              setSelectedJob(job);
            }
          }}
          className={`bg-slate-800 border rounded-xl p-4 cursor-pointer transition
            ${
              snapshot.isDragging
                ? "border-blue-500 shadow-lg scale-[1.02]"
                : "border-slate-700 hover:border-blue-500"
            }`}
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold text-slate-100">
                {job.company}
              </h3>
              <p className="text-sm text-slate-400">
                {job.role}
              </p>
            </div>

            <span
              className={`text-xs px-2 py-1 rounded-full ${
                priorityColor[job.priority] ||
                "bg-slate-700 text-slate-300"
              }`}
            >
              {job.priority}
            </span>
          </div>

          {/* Follow-up Indicator */}
          {isFollowUpDue && (
            <div className="text-xs text-red-400 font-medium mt-2">
              ⚠ Follow-up needed
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default JobCard;

import { Draggable } from "@hello-pangea/dnd";
import React from "react";

const JobCard = ({ job, index, setSelectedJob }) => {

    const priorityColor = {
  low: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-red-100 text-red-700",
};

const JobCard = ({ job, index, setSelectedJob })


  const isFollowUpDue =
    job.followUpDate && new Date(job.followUpDate) <= new Date();

  return (
    <Draggable draggableId={job._id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => setSelectedJob(job)}

          className="bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-blue-500 transition cursor-pointer"

        >
          <h3 className="font-semibold">{job.company}</h3>
          <p className="text-sm text-gray-600">{job.role}</p>

          {isFollowUpDue && (
            <span className="text-xs text-red-500 font-semibold">
              Follow up needed
            </span>
          )}

          <div className="flex justify-between items-center mb-2">
  <span
    className={`text-xs px-2 py-1 rounded-full ${priorityColor[job.priority]}`}
  >
    {job.priority}
  </span>

  {job.followUpDate &&
    new Date(job.followUpDate) <= new Date() && (
      <span className="text-xs text-red-500 font-semibold">
        Follow up
      </span>
    )}
</div>

        </div>
      )}
    </Draggable>
  );
};

export default JobCard;

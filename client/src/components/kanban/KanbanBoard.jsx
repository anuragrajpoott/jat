import { DragDropContext } from "@hello-pangea/dnd";
import { STATUS_COLUMNS } from "../../constants/statusColumns";
import KanbanColumn from "./KanbanColumn";
import { updateJob } from "../../apis/jobs";
import React from "react";

const KanbanBoard = ({ jobs, setJobs, setSelectedJob }) => {
  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const newStatus = destination.droppableId;

    // Optimistic UI update
    const updatedJobs = jobs.map((job) =>
      job._id === draggableId ? { ...job, status: newStatus } : job
    );

    setJobs(updatedJobs);

    try {
      await updateJob(draggableId, { status: newStatus });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-6 overflow-x-auto px-6 py-6 scrollbar-thin scrollbar-thumb-slate-700"
>
        {STATUS_COLUMNS.map((status) => (
          <KanbanColumn
  key={status}
  status={status}
  jobs={jobs.filter((job) => job.status === status)}
  setSelectedJob={setSelectedJob}
/>

        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;

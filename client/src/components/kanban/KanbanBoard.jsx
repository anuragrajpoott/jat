import React from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { STATUS_COLUMNS } from "../../constants/statusColumns";
import KanbanColumn from "./KanbanColumn";
import { updateJob } from "../../apis/jobs";

const KanbanBoard = ({ jobs, setJobs, setSelectedJob }) => {

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (destination.droppableId === source.droppableId) {
      return;
    }

    const newStatus = destination.droppableId;
    const previousJobs = [...jobs];

    const updatedJobs = jobs.map((job) =>
      job._id === draggableId
        ? { ...job, status: newStatus }
        : job
    );

    setJobs(updatedJobs);

    try {
      await updateJob(draggableId, { status: newStatus });
    } catch (error) {
      console.error("Status update failed:", error);
      setJobs(previousJobs);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-6 overflow-x-auto px-6 py-6 scrollbar-thin scrollbar-thumb-slate-700">
        {STATUS_COLUMNS.map((column) => (
          <KanbanColumn
            key={column.key}
            status={column.key}
            title={column.label}
            jobs={jobs.filter(
              (job) => job.status === column.key
            )}
            setSelectedJob={setSelectedJob}
          />
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;

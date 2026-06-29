import { Draggable } from "@hello-pangea/dnd";
import type { Task } from "../../types/task";

interface Props {
  task: Task;
  index: number;

  onDelete: (id: string) => void;

  onEdit: (task: Task) => void;
}



const TaskCard = ({
  task,
  index,
  onDelete,
  onEdit,
}: Props) => {
  
  console.log("Rendering TaskCard:", task);
    const isOverdue = 
      task.dueDate && 
      new Date(task.dueDate) < new Date() &&
      task.status !== "Done";


  return (
    <Draggable
      draggableId={task._id}
      index={index}
    >
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white rounded-lg shadow-md p-4 mb-3 border ${
            isOverdue
            ? "bg-red-50 border-red-500"
            : "bg-white border-gray-200"
          }`}
        >
          <h3 className="font-semibold">
            {task.title}
          </h3>

          <p className="text-sm text-gray-500 mt-2">
            {task.description}
          </p>

          <p className="text-xs text-gray-500 mt-2">
            Due:{" "}
            {task.dueDate
              ? new Date(task.dueDate).toLocaleDateString()
              : "No due date" }
          </p>

          {task.dueDate && 
            new Date(task.dueDate).toLocaleDateString() === 
              new Date().toDateString() && (
                <span className="text-yellow-600 text-xs font-semibold">
                  Due Today
                </span>
              )}

          <div className="flex justify-between items-center mt-3">

            <div className="flex gap-2 mt-3">
                <button
                  onClick={() => onEdit(task)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                    Edit
                </button>  

                <button 
                  onClick={() => onDelete(task._id)}
                  className="bg-red-600 text-white px-2 py-1 rounded"
                >
                    Delete
                </button> 

            </div>
            <span className={`px-2 py-1 rounded text-white text-xs ${
                task.priority === "High"
                ? "bg-red-600"
                : task.priority === "Medium"
                ? "bg-yellow-500"
                : "bg-green-600"
            }`}
            >
                {task.priority}
            
             
            </span>

            <span>
              {task.assignedTo}
            </span>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
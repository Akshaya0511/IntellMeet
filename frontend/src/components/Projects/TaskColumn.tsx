import { Droppable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";
import type { Task } from "../../types/task";

interface TaskColumnProps {
  title: string;
  columnId: string;
  tasks: Task[];
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

const TaskColumn = ({
  title,
  columnId,
  tasks,
  onDelete,
  onEdit,
}: TaskColumnProps) => {

  console.log("COLUMN:", title);
  console.log("TASKS:", tasks);
  console.log("COUNT:", tasks.length);

  return (
    <div className="bg-gray-100 rounded-lg p-4 w-80 min-h-[500px]">
      <h2 className="text-lg font-bold mb-4">
        {title}
      </h2>

      <Droppable droppableId={columnId}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="min-h-[200px]"
          >
            {tasks.length === 0 ? (
              <div className="text-center text-gray-400 py-6">
                No tasks here
                </div>
            ) : (
             tasks.map((task, index) => (
              <TaskCard
                key={task._id}
                task={task}
                index={index}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            ))
            )}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default TaskColumn;
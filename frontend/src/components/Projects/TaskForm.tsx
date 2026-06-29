import { useEffect, useState } from "react";
import { 
    createTask, 
    updateTask,
    getEmployees, 
    uploadAttachments,
} from "../../services/taskService";
import type { Task } from "../../types/task";
import { socket } from "../../services/socket";
import { toast } from "react-toastify";


interface TaskFormProps {
  projectId: string;
  onTaskCreated: (task: Task) => void;
  editingTask?: Task | null;
  onTaskUpdated?: (task: Task) => void;
}

const TaskForm = ({
  projectId,
  onTaskCreated,
  onTaskUpdated,
  editingTask,
}: TaskFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"Low"| "Medium" | "High">("Medium");
  const [employees, setEmployees] = useState<any[]>([]);
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [files, setFiles] = useState<File[]>([]);


  useEffect(() => {
    if (editingTask) {
        setTitle(editingTask.title);
        setDescription(editingTask.description ?? "");
        setPriority(editingTask.priority ?? "Medium");
        setAssignedTo(editingTask.assignedTo ?? "");
        setDueDate(
            editingTask.dueDate
            ? editingTask.dueDate.split("T")[0]
            : ""
        );

        } else {
            setTitle("");
            setDescription("");
            setPriority("Medium");
        }
    }, [editingTask]);

    useEffect(() => {
        const loadEmployees = async () => {
            try {
                const data = await getEmployees();
                setEmployees(data);
            } catch (error) {
                console.error(error);
            }
        };
        
        loadEmployees();
    }, []);

 


  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    console.log("handleSubmit called");

    try {
        if (editingTask) {
            const updatedTask = await updateTask(editingTask._id, {
                title,
                description,
                priority,
                assignedTo,
                dueDate,
            });

            onTaskUpdated?.(updatedTask);

            toast.success("Task updated successfully!");

            socket.emit("task-status-updated", updatedTask);
        } else {
          console.log("Submitting task...");

          const task = await createTask({
            title,
            description,
            projectId,
            status: "Todo",
            priority,
            assignedTo,
            dueDate,
            createdBy: "ADMIN001", 
      
      });

      if (files.length > 0) {
        await uploadAttachments(task._id, files);
      }

    

      onTaskCreated(task);

      toast.success("Task created successfully!");

      socket.emit("task-created", task);
    }

      setTitle("");
      setDescription("");
      setPriority("Medium");
      setFiles([]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create task!");
    }
  };

  

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-lg shadow mb-6"
    >
      <h2 className="text-lg font-bold mb-4">
        {editingTask ? "Edit Task" : "Create Task"}
      </h2>

      <input
        className="border w-full p-2 rounded mb-3"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="border w-full p-2 rounded mb-3"
        placeholder="Description"
        value={description}
        onChange={(e) =>
          setDescription(e.target.value)
        }
      />

      <select 
        className="border w-full p-2 rounded mb-3"
        value={priority}
        onChange={(e) => setPriority(e.target.value as "Low" | "Medium" | "High")}
        >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
        </select>

        <select 
          className="border w-full p-2 rounded mb-3"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          >
            <option value="">Assign Employee</option>

            {employees.map((employee: any) => (
                <option
                  key={employee._id}
                  value={employee._id}
                  >
                    {employee.name}
                  </option>
            ))}
          </select>

          <input 
            type="date"
            className="border w-full p-2 rounded mb-3"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            />

            <input 
              type="file"
              multiple
              className="border w-full p-2 rounded mb-3"
              onChange={(e) => {
                if (e.target.files) {
                  setFiles(Array.from(e.target.files));
                }
              }}
              />

              <input 
                type="file"
                multiple
                className="border w-full p-2 rounded mb-3"
                onChange={(e) => {
                  if (e.target.files) {
                    setFiles(Array.from(e.target.files));
                  }
                }}
                />


      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        type="submit"
      >
        {editingTask ? "Update Task" : "Create Task"}
      </button>
    </form>
  );
};

export default TaskForm;
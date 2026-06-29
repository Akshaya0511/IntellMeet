import { useEffect, useState } from "react";
import TaskForm from "./TaskForm";
import { socket } from "../../services/socket";
import { getEmployees } from "../../services/taskService";
import { toast } from "react-toastify";
import TaskPieChart from "../Charts/PieChart";
import TaskBarChart from "../Charts/BarChart";
import RecentTasks from "./RecentTasks";
import TaskCalendar from "./TaskCalendar";

import {
  DragDropContext,
  type DropResult,
} from "@hello-pangea/dnd";

import TaskColumn from "./TaskColumn";

import type { Task } from "../../types/task";

import {
  getTasks,
  updateTask,
  deleteTask,
} from "../../services/taskService";

const KanbanBoard = () => {
const [tasks, setTasks] = useState<Task[]>([]);
const [loading, setLoading] = useState(false);

const [search, setSearch] = useState("");
const [priorityFilter, setPriorityFilter] = useState("");
const [employeeFilter, setEmployeeFilter] = useState("");
const [employees, setEmployees] = useState<any[]>([]);


const [editingTask, setEditingTask] = 
   useState<Task | null>(null);

const handleTaskCreated = (task: Task) => {
    setTasks((prev) => [...prev, task]);
 };
   
const handleEdit = (task: Task) => {
    setEditingTask(task);
 
};  

  useEffect(() => {
    loadTasks();
    loadEmployees();

    const onCreate = (task: Task) => {
      setTasks((prev) => [...prev, task]);
    };

    const onUpdate = (updatedTask: Task) => {
      setTasks((prev) =>
        prev.map((task) =>
           task._id === updatedTask._id ? updatedTask : task));
    };

    const onDelete = (taskId: string) => {
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    };

  socket.on(
    "task-created",
    (task: Task) => {
        setTasks((prev) => [...prev, task]);
    }
  );

  socket.on(
    "task-status-updated",
    (updatedTask: Task) => {
        setTasks((prev) => 
          prev.map((task) => 
           task._id === updatedTask._id
             ? updatedTask
             : task
            ));
    }
  );

  socket.on(
    "task-deleted",
    (taskId: string) => {
        setTasks((prev) =>
          prev.filter(
            (task) => task._id !== taskId
          ));
    }
  );

  return () => {
    socket.off("task-created", onCreate);
    socket.off("task-status-updated", onUpdate);
    socket.off("task-deleted", onDelete);

  };
  }, []);


  const loadTasks = async () => {
    try {
      const data = await getTasks();
      console.log("TASKS FROM API:", data);
      setTasks(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
        await deleteTask(id);

        setTasks((prev) => 
          prev.filter((task) => task._id !== id)
    );

    toast.success("Task deleted successfully!");

    socket.emit("task-deleted", id);
    } catch (error) {
        console.log(error);
    }
  };

  

     const loadEmployees = async () => {
        try {
            const data = await getEmployees();
            setEmployees(data);
        } catch (error) {
            console.log(error);
        }
    };      
 
    const onDragEnd = async (
    result: DropResult
  ) => {
    const { destination, draggableId } = result;

    if (!destination) return;

    const newStatus = destination.droppableId as
      | "Todo"
      | "In Progress"
      | "Done";

    setTasks((prev) =>
      prev.map((task) =>
        task._id === draggableId
          ? {
              ...task,
              status: newStatus,
            }
          : task
      )
    );

    try {
        const updatedTask = await updateTask(draggableId, {
            status: newStatus,
        });

        socket.emit("task-status-updated", updatedTask);
    } catch (error) {
        console.error(error);
        loadTasks();
    }

};

      const handleTaskUpdated = (updatedTask: Task) => {
        setTasks((prev) =>
          prev.map((task) =>
            task._id === updatedTask._id
                ? updatedTask
                : task
            ));

            setEditingTask(null);
      }

     const filteredTasks = tasks.filter(
        (task) => {
            const matchesSearch = 
             task.title.toLowerCase().includes(search.toLowerCase()) ||
             task.description?.toLowerCase().includes(search.toLowerCase());

            const matchesPriority = 
             priorityFilter === "" ||
             task.priority === priorityFilter;

            const matchesEmployee = 
             employeeFilter === "" || 
             task.assignedTo === employeeFilter;

            return (
                matchesSearch &&
                matchesPriority &&
                matchesEmployee
    
            )
        });

        console.log("STATE TASKS:", tasks);

        console.log(
          tasks.map((t) => ({
            title: t.title,
            status: t.status,
          }))
        );

        console.log(
          "Todo:",
          filteredTasks.filter(t => t.status === "Todo")
        );

        console.log(
          "In Progress:",
          filteredTasks.filter(t => t.status === "In Progress")
        );

        console.log(
          "Done:",
          filteredTasks.filter(t => t.status === "Done")
        );

        if (loading) {
          return (
            <div className="p-6 text-center">
              Loading tasks...
            </div>
          );
        }

    

    return (
        <>
        <TaskForm
          projectId="6a42261d426a0e2bf72d8955"
          onTaskCreated={handleTaskCreated}
          editingTask={editingTask}
          onTaskUpdated={handleTaskUpdated}
          />

          <input 
             type="text"
             placeholder="Search tasks..."
             value={search}
             onChange={(e) => setSearch(e.target.value)}
             className="border rounded-lg p-2 w-full mb-4"
             />

             <select 
               value={priorityFilter}
               onChange={(e) => setPriorityFilter(e.target.value)}
               className="border rounded p-2 mb-4 mr-2"
    >
              <option value="">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
          </select>

             <select 
               value={employeeFilter}
               onChange={(e) => setEmployeeFilter(e.target.value)}
               className="border rounded p-2 mb-4"
             >
             <option value="">All Employees</option>

              {employees.map((employee) =>(
             <option 
                key={employee._id}
                value={employee._id}
              >
                {employee.name}
           </option>
            )
        )}
      </select>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
         <TaskPieChart tasks ={filteredTasks} />
         <TaskBarChart tasks ={filteredTasks} />
      </div>

      <RecentTasks tasks={filteredTasks} />

      <TaskCalendar tasks={filteredTasks} />

           <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-6 overflow-x-auto p-4">

         <TaskColumn
          title="Todo"
          columnId="Todo"
          tasks={filteredTasks.filter(
            (t) => t.status === "Todo"
          )}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />

        <TaskColumn
          title="In Progress"
          columnId="In Progress"
          tasks={filteredTasks.filter(
            (t) => t.status === "In Progress"
          )}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />

        <TaskColumn
          title="Done"
          columnId="Done"
          tasks={filteredTasks.filter(
            (t) => t.status === "Done"
          )}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />

      </div>
    </DragDropContext>
    </>
  );
};


export default KanbanBoard;
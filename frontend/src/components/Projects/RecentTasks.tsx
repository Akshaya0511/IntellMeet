import type { Task } from "../../types/task";

interface RecentTasksProps {
  tasks: Task[];
}

const RecentTasks = ({ tasks }: RecentTasksProps) => {
  const recentTasks = [...tasks]
    .sort(
      (a, b) =>
        new Date(b.createdAt ?? "").getTime() -
        new Date(a.createdAt ?? "").getTime()
    )
    .slice(0, 5);

  return (
    <div className="bg-white rounded-lg shadow p-4 mt-6">
      <h2 className="text-xl font-bold mb-4">
        Recent Tasks
      </h2>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Title</th>
            <th className="text-left p-2">Priority</th>
            <th className="text-left p-2">Status</th>
            <th className="text-left p-2">Due Date</th>
          </tr>
        </thead>

        <tbody>
          {recentTasks.map((task) => (
            <tr
              key={task._id}
              className="border-b hover:bg-gray-50"
            >
              <td className="p-2">{task.title}</td>
              <td className="p-2">{task.priority}</td>
              <td className="p-2">{task.status}</td>
              <td className="p-2">
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString()
                  : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentTasks;
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import type { Task } from "../../types/task";

interface BarChartProps {
  tasks: Task[];
}

const TaskBarChart = ({ tasks }: BarChartProps) => {
  const data = [
    {
      priority: "Low",
      count: tasks.filter(
        (task) => task.priority === "Low"
      ).length,
    },
    {
      priority: "Medium",
      count: tasks.filter(
        (task) => task.priority === "Medium"
      ).length,
    },
    {
      priority: "High",
      count: tasks.filter(
        (task) => task.priority === "High"
      ).length,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4">
        Tasks by Priority
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="priority" />

          <YAxis allowDecimals={false} />

          <Tooltip />

          <Bar
            dataKey="count"
            fill="#3B82F6"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TaskBarChart;
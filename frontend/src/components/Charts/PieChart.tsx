import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import type { Task } from "../../types/task";

interface PieChartProps {
  tasks: Task[];
}

const COLORS = [
  "#3B82F6", // Todo
  "#F59E0B", // In Progress
  "#22C55E", // Done
];

const TaskPieChart = ({ tasks }: PieChartProps) => {
  const data = [
    {
      name: "Todo",
      value: tasks.filter(
        (task) => task.status === "Todo"
      ).length,
    },
    {
      name: "In Progress",
      value: tasks.filter(
        (task) => task.status === "In Progress"
      ).length,
    },
    {
      name: "Done",
      value: tasks.filter(
        (task) => task.status === "Done"
      ).length,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4">
        Tasks by Status
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            label
          >
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={COLORS[index]}
              />
            ))}
          </Pie>

          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TaskPieChart;
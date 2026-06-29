import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import type { Task } from "../../types/task";

interface TaskCalendarProps {
  tasks: Task[];
}

const TaskCalendar = ({ tasks }: TaskCalendarProps) => {
  const events = tasks
    .filter((task) => task.dueDate)
    .map((task) => ({
      id: task._id,
      title: task.title,
      date: task.dueDate?.split("T")[0],
    }));

  return (
    <div className="bg-white rounded-lg shadow p-4 mt-6">
      <h2 className="text-xl font-bold mb-4">
        Task Calendar
      </h2>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        height="auto"
      />
    </div>
  );
};

export default TaskCalendar;
import { useEffect, useState } from "react";
import { socket } from "../services/socket";
import KanbanBoard from "@/components/Projects/KanbanBoard";


const Workspace = () => {
  const [notification, setNotification] = useState("");
  const [summaries, setSummaries] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalMeetings: 0,
    completedMeetings: 0,
    totalTasks: 0,
    completedTasks: 0,
  });

  useEffect(() => {
    fetchSummaries();
    fetchDashboardStats();

    socket.on(
        "notification",
        (message: string) => {
            setNotification(message);

            setTimeout(() => {
                setNotification("");
            }, 3000);
        }
    );

    return () => {
        socket.off("notification");
    };
  }, []);

  

  const fetchDashboardStats = async () => {
    const token = localStorage.getItem("accessToken");

    const res = await fetch(
      "http://localhost:5000/api/meetings/dashboard/stats",
      {

        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
  
  setStats(data);
  };

  const fetchSummaries = async () => {
    const token = localStorage.getItem("accessToken");

    const res = await fetch(
      "http://localhost:5000/api/meetings",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    setSummaries(data);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Team Workspace</h1>

      <div 
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "20px",
        }}
        >

          <div>
            <h3>Total Meetings</h3>
            <p>{stats.totalMeetings}</p>
          </div>

          <div>
            <h3>AI Summaries</h3>
            <p>{stats.completedMeetings}</p>
          </div>

          <div>
            <h3>Total Tasks</h3>
            <p>{stats.totalTasks}</p>
          </div>

          <div>
            <h3>Completed Tasks</h3>
            <p>{stats.completedTasks}</p>
          </div>
        </div>

      {notification && (
        <div
          style={{
            background: "#e8f5e9",
            padding: "10px",
            marginTop: "10px",
            marginBottom: "10px",
            borderRadius: "5px",
          }}
          >
            {notification}
            </div>
      )} 
      {/* kanban Board */}

      <KanbanBoard />
     

    <hr />

    <h2>Meeting Summaries</h2>

    {summaries.map((meeting) => (
      <div
        key={meeting._id}
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          marginBottom: "10px",
        }}
        >

          <h3>{meeting.title}</h3>

          <button 
           onClick={() =>
            window.open(
              `http://localhost:5000/api/meetings/pdf/${meeting._id}`
            )
           }
           >
            Download PDF
           </button>

      

          <p>
            <strong>Summary:</strong>{" "}
            {meeting.summary || "No summary yet"}
          </p>

          <strong>Action Items:</strong>

          <ul>
            {meeting.actionItems?.map(
              (item: string, index: number) => (
                <li key={index}>{item}</li>
              )
            )}
          </ul>
        </div>
    ))}
</div>
);
};


 
export default Workspace;
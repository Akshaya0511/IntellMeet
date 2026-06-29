import { useEffect, useState } from "react";

interface Attendance {
  _id: string;
  employeeId: string;
  status: string;
  workHours: number;
}

const Attendance = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [attendance, setAttendance] = useState<Attendance[]>([]);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    const res = await fetch(
      "http://localhost:5000/api/attendance"
    );

    const data = await res.json();

    setAttendance(data);
  };

  const addAttendance = async () => {
    await fetch(
      "http://localhost:5000/api/attendance",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeId,
          checkIn: new Date(),
        }),
      }
    );

    setEmployeeId("");

    fetchAttendance();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Attendance Management</h1>

      <input
        placeholder="Employee ID"
        value={employeeId}
        onChange={(e) =>
          setEmployeeId(e.target.value)
        }
      />

      <button onClick={addAttendance}>
        Check In
      </button>

      <hr />

      <h2>Attendance Records</h2>

      {attendance.map((record) => (
        <div
          key={record._id}
          style={{
            border: "1px solid gray",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
        <button 
           onClick={async () => {
            await fetch(
             `http://localhost:5000/api/attendance/checkout/${record._id}`,
                {
                  method: "PUT",
                }
            );

            fetchAttendance();
          }}
        >
         Check Out
     </button>

          <p>Employee: {record.employeeId}</p>
          <p>Status: {record.status}</p>
          <p>Hours: {record.workHours}</p>
        </div>
      ))}
    </div>
  );
};

export default Attendance;
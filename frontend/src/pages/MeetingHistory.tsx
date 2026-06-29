import { useEffect, useState } from "react";

interface Meeting {
    _id: string;
    title: string;
    meetingId: string;
    createdAt: string;
    participants?: number;
    recordings?: string;
    summary?: string;
    actionItems?: string[];
    transcript?: string;
}

  const MeetingHistory = () => {
    const [meetings, setMeetings] = useState<Meeting[]>([]);

    const API = "http://localhost:5000/api/meetings";

    useEffect(() => {
        fetchMeetings();
     }, []);

     const fetchMeetings = async () => {
        try {
            const token = localStorage.getItem("accessToken");


            const response = await fetch(API, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            console.log("Meeting History:", data);

           
        if (Array.isArray(data)) {
            setMeetings(data);
        } else {
            console.log("Unexpected response:", data);
            setMeetings([]);
     }
        } catch (error) {
            console.log(error);
        }
     };


    return (
        <div>
            <h1>Meeting History</h1>

            
            {Array.isArray(meetings) &&
             meetings.map((meeting) => (

                <div
                key={meeting._id}
                style={{
                    border: "1px solid gray",
                    marginBottom: "10px",
                    padding: "10px",
                }}
            >
                <h3>{meeting.title}</h3>

                <p>
                    <strong>Meeting Code:</strong>{" "}
                    {meeting.meetingId}
                </p>

                <p>
                    <strong>Date:</strong>{" "}
                    {meeting.createdAt
                      ? new Date(
                        meeting.createdAt
                      ).toLocaleString()
                    : "N/A"}
                </p>

                <p>
                    <strong>Particpants:</strong>{" "}
                    {meeting.participants ?? 0}
                </p>
                
                <p>
                    <strong>Summary:</strong>{" "}
                    {meeting.summary || "No summary"}
                </p>

                <p>
                    <strong>Action Items:</strong>
                </p>

                {meeting.actionItems &&
                meeting.actionItems.length > 0 ? (
                    <ul>
                        {meeting.actionItems.map(
                            (item, index) => (
                                <li key={index}>{item}</li>
                            )
                        )}
                    </ul>
                ) : (
                    <p>No action items</p>

                )}

                
            
                    

                <p>
                    <strong>Transcript:</strong>
                </p>

                <div
                 style={{
                    background: "#f5f5f5",
                    padding: "10px",
                    borderRadius: "5px",
                 }}
                 >
                    {meeting.transcript || "No transcript"}
                </div>
                </div>


            ))}
  </div>
  
  );

};

export default MeetingHistory;
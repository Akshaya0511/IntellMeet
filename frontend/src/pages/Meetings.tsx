import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Video, Copy, Trash2, LogIn } from "lucide-react";
import { Button } from "../components/ui/button";

interface Meeting {
  _id: string;
  title: string;
  meetingId: string;
}

const Meetings = () => {
  const [title, setTitle] = useState("");
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const navigate = useNavigate();

  
  const API = "http://localhost:5000/api/meetings";

  // GET meetings
  const fetchMeetings = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const res = await axios.get(API, {
        headers: {
          Authorization: `Bearer ${token}`,
        }

      });

      console.log("Meetings API Response:", res.data);
      
      setMeetings(res.data);
    } catch (err) {
      console.log("Error fetching meetings");
    }
  };

  // CREATE meeting
  const createMeeting = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const res = await axios.post(API, { title },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Created Meeting:", res.data);

      localStorage.setItem(
        "meetingMongoId",
        res.data._id
      );

      setTitle("");
      fetchMeetings();
    } catch (err) {
      console.log("Error creating meeting");
    }
  };

  // COPY CODE
  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    alert("Meeting code copied!");
  };

  // DELETE meeting (frontend only for now)
  const deleteMeeting = async (id: string) => {
    await axios.delete(`${API}/${id}`);
    setMeetings(meetings.filter((m) => m._id !== id));
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  //UI
  return (
  <div className="max-w-6xl mx-auto p-8">
    <h1 className="text-4xl font-bold mb-6">
      Meetings
    </h1>

    <div style={styles.createBox}>
      <input
        type="text"
        placeholder="Enter meeting title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={styles.input}
      />

      <Button onClick={createMeeting}>
        <Video className="mr-2 h-4 w-4" />
        Create Meeting
      </Button>
    </div>

    <h2>My Meetings</h2>

    {meetings.length === 0 && (
      <p>No meetings found</p>
    )}

    {meetings.map((m) => (
      <div
        key={m._id}
        className="
          border
          rounded-xl
          p-5
          shadow-sm
          hover:shadow-lg
          transition
          bg-white
          mb-4
          "
      >
        <h3>{m.title}</h3>

        <p>
          Code: {m.meetingId}
        </p>

        <div style={styles.btnRow}>
          <Button 
            variant="outline"
            onClick={() => copyCode(m.meetingId)}
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy
            </Button>

          <Button
            variant="secondary"
            onClick={() => {
              localStorage.setItem(
                "meetingMongoId",
                m._id
              );

              navigate(`/call/${m.meetingId}`);
            }}
            >
              <LogIn className="mr-2 h-4 w-4" />
              Join
            </Button>

            <Button
              variant="outline"
              onClick={() => deleteMeeting(m._id)} 
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>

          
        </div>
      </div>
    ))}
  </div>
);
};

export default Meetings;

const styles: any = {
  container: {
    padding: "30px",
    fontFamily: "Arial",
    maxWidth: "900px",
    margin: "auto",
  },

  userCard: {
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "20px",
    marginTop: "20px",
  },

  statsCard: {
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "20px",
    marginTop: "20px",
    textAlign: "center",
  },

  buttonContainer: {
    display: "flex",
    gap: "20px",
    marginTop: "20px",
  },

  button: {
    padding: "12px 20px",
    cursor: "pointer",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },

  recentCard: {
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "20px",
    marginTop: "20px",
  },

  logoutButton: {
    marginTop: "20px",
    padding: "12px 20px",
    cursor: "pointer",
    borderRadius: "8px",
  },

  creatorBox: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },

  input: {
    flex: 1,
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },

  card: {
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "20px",
    marginBottom: "15px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },

  btnRow: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },

};
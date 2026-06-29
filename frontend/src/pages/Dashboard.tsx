import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Video, 
  History, 
  FolderKanban, 
  Users, 
  Activity, 
} from "lucide-react";

import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
} from "../components/ui/card";

import { Button } from "../components/ui/button";

function Dashboard() {
    const [user, setUser] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
              const token = localStorage.getItem("accessToken");

              //DEBUG LOG
              console.log("TOKEN:", token);

              if (!token) {
                navigate("/login");
                return;
              }

              const response = await fetch(
                "http://localhost:5000/api/auth/profile",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },              
                 }
              );

              const data = await response.json();

              setUser(data.user);
            } catch (error) {
              console.error(error);
            }


        };

        fetchProfile();
    }, []);

    const logout = () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      navigate("/login");
    };


  return (
  <div className="min-h-screen bg-slate-100 p-8">
    <h1>🚀 INTELLMEET</h1>

    <h2>
      Welcome, {user?.name}
    </h2>

    <div style={styles.profileCard}>
      <p> 
        <strong>Name:</strong> {user?.name}
      </p>

      <p> 
        <strong>Email:</strong> {user?.email}
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video size={20} />
            Meetings
          </CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users size={20} />
            Participants
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-3xl font-bold">5000</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity size={20} />
            Active Calls
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-3xl font-bold">4500</p>
        </CardContent>
      </Card>
      </div>

    <div style={styles.buttonRow}>
      <Button
        onClick={() => navigate("/meetings")}
      >
        Create Meeting
      </Button>

      <Button
        onClick={() => navigate("/meetings")}
      >
        Join Meeting
      </Button>
    </div>

    <Button
      onClick={() => navigate("/history")}
      >
        Meeting History
      </Button>

      <div style={styles.recentCard}>
        <h2>Project Status</h2>
        <p>Authentication</p>
        <p>Meetings</p>
        <p>Video Calling</p>
        <p>AI Summary</p>
        <p>Workspace</p>
      </div>

    <div style={styles.recentCard}>
      <h2>Recent Meetings</h2>

      <p>📹 Project </p>
      <p>📹 Sprint Planning</p>
      <p>📹 Team Sync</p>
    </div>

    <div style={styles.quickActions}>
      <div
        style={styles.actionCard}
        onClick={() => navigate("/meetings")}
        >
          <Video size={40} />
          <h3>Meetings</h3>
          <p>Create and join meetings</p>
        </div>

        <div
          style={styles.actionCard}
          onClick={() => navigate("/history")}
         >
         
         <History size={40} />
         <h3>History</h3>
         <p>View summaries and transcripts</p>
         </div>

         <div 
           style={styles.actionCard}
           onClick={() => navigate("/workspace")}
           >
            <FolderKanban size={40} />

            <h3>Workspace</h3>
            <p>Manage action items and tasks</p>
            </div>
           </div>    

    <Button
      onClick={logout}
      style={{
        marginTop: "20px",
        padding: "10px 20px",
        borderRadius: "8px",
        cursor: "pointer",
      }}
    >
      Logout
    </Button>
  </div>
);
        
}

export default Dashboard;

const styles: any = {
  container: {
    padding: "30px",
  },

  quickActions: {
  display: "flex",
  gap: "20px",
  marginTop: "30px",
},

actionCard: {
  flex: 1,
  border: "1px solid #ddd",
  borderRadius: "12px",
  padding: "20px",
  cursor: "pointer",
  textAlign: "center",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
},

profileCard: {
  border: "1px solid #ddd",
  borderRadius: "10px",
  padding: "15px",
  marginTop: "20px",
},

  statsContainer: {
    display: "flex",
    gap: "20px",
    marginTop: "20px",
  },

  card: {
    flex: 1,
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "20px",
    textAlign: "center",
  },

  buttonRow: {
    display: "flex",
    gap: "20px",
    marginTop: "20px",
  },

  recentCard: {
    marginTop: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "20px",
  },
};


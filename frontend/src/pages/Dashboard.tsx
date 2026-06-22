import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


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
    };


    return (
  <div style={styles.container}>
    <h1>🚀 INTELLMEET</h1>

    <h2>
      Welcome, {user?.name}
    </h2>

    <div style={styles.statsContainer}>
      <div style={styles.card}>
        <h3>Meetings</h3>
        <h1>10</h1>
      </div>

      <div style={styles.card}>
        <h3>Participants</h3>
        <h1>5000</h1>
      </div>

      <div style={styles.card}>
        <h3>Active Calls</h3>
        <h1>4500</h1>
      </div>
    </div>

    <div style={styles.buttonRow}>
      <button
        onClick={() => navigate("/meetings")}
      >
        Create Meeting
      </button>

      <button
        onClick={() => navigate("/meetings")}
      >
        Join Meeting
      </button>
    </div>

    <button
      onClick={() => navigate("/history")}
      >
        Meeting History
      </button>

    <div style={styles.recentCard}>
      <h2>Recent Meetings</h2>

      <p>📹 Project </p>
      <p>📹 Sprint Planning</p>
      <p>📹 Team Sync</p>
    </div>

    <button
      onClick={logout}
    >
      Logout
    </button>
  </div>
);
        
}

export default Dashboard;

const styles: any = {
  container: {
    padding: "30px",
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
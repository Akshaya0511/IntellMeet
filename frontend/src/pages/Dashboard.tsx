import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


function Dashboard() {
    const [user, setUser] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
              const token = localStorage.getItem("token");

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

              setUser(data);
            } catch (error) {
              console.error(error);
            }


        };

        fetchProfile();
    }, []);

    const logout = () => {
      localStorage.removeItem("token");
     navigate("/");
    };

    return (
        <div style={{ padding: "50px "}}>
            <h1>Welcome to IntellMeet Dashboard</h1>

        {user && (
            <>
             <h3>Name: {user.name}</h3>
             <h3>Email: {user.email}</h3>
             <h3>Role: {user.role}</h3>
            </>
        )}

        <br />

        <button onClick={logout}>
            Logout
        </button>
        </div>
    );
}

export default Dashboard;
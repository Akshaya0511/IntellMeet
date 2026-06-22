import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); 
  
    console.log("EMAIL:", email);
    console.log("PASSWORD:", password);

    if (!email || !password) {
      alert("Email and Password required");
      return;
    }
    console.log(" 1 LOGIN BUTTON CLICKED");
    console.log(" 2 FROM SUBMIT WORKING");
    console.log(" 3 SENDING REQUEST TO BACKEND");

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

        // DEBUG STEP 1
      console.log("STATUS:", response.status);

        // DEBUG STEP 2
      const text = await response.text();
      console.log("RAW RESPONSE:", text);

      let data;
        
      try {
       data = JSON.parse(text);
      } catch {
          console.log("Response is not valid JSON");
          return;
        }

        console.log("PARSED DATA:", data);

      if (!response.ok) {
        alert(data.message || "Login failed");
        return;
      }


      console.log("4 RESPONSE DATA:", data);

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      console.log("LOGIN SUCCESS");

      navigate("/dashboard");
     } catch (error) {
      console.error(" LOGIN ERROR:", error);
    }
  };

  return (
    <div style={{ padding: "50px" }}>
      <h1>IntellMeet Login</h1>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <br />
        <br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <br />
        <br />

        <button type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
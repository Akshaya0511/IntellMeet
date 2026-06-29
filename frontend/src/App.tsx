import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employee from "./pages/HR/Employee";
import { Button } from "./components/ui/button";
import Meetings from "./pages/Meetings";
import VideoCall  from "./pages/VideoCall";
import MeetingHistory from "./pages/MeetingHistory";
import Workspace from "./pages/Workspace";
import Attendance from "./pages/HR/Attendance";


function App() {
  return (
    <>
    <div className="p-10">
      <Button>Create Meeting</Button>
    </div>
  
    <BrowserRouter>
    <Routes>

      {/* Default Route */}
      <Route path="/" element={<Navigate to="/Login" />} />

      <Route path="/employee" element={<Employee />} />

      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* Protected Route */}
      <Route path="/dashboard" element={<Dashboard />}
      />
      
      <Route path="/meetings" element={<Meetings />} 
      />

      <Route path="/attendance" element={<Attendance />}
      />

      <Route path="/call/:meetingCode" element={<VideoCall />}
      />

      <Route path="/history" element={<MeetingHistory />} 
      />

      <Route path="/workspace" element={<Workspace />}
      />

      </Routes>
    </BrowserRouter>
  </>
  );

}

export default App;
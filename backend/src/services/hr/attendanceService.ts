import * as attendanceRepository from "../../repositories/hr/attendanceRepository";
import Attendance  from "../../models/hr/Attendance";

// Get all attendance
export const getAllAttendance = async () => {
  return await attendanceRepository.findAllAttendance();
};

// Create attendance
export const addAttendance = async (data: any) => {
    const { employeeId, meetingId } = data;

    console.log("========== addAttendance called ============");
    console.log(data);
    console.trace();

    const existing = 
      await attendanceRepository.findActiveAttendance(
        employeeId,
        meetingId
      );

      if (existing) {
        throw new Error("Attendance already active");
      }

      const attendanceData = {
        employeeId,
        meetingId,
        status: "Present",
        checkIn: new Date(),
        checkOut: null,
        workHours: 0,
        date: new Date(),
      };
      
     return await attendanceRepository.createAttendance(attendanceData);
};

// Update attendance
export const editAttendance = async (
  id: string,
  data: any
) => {
  return await attendanceRepository.updateAttendance(id, data);
};

// Delete attendance
export const removeAttendance = async (
  id: string
) => {
  return await attendanceRepository.deleteAttendance(id);
};

// Get attendance by ID
export const getAttendanceById = async (
  id: string
) => {
  return await attendanceRepository.findAttendanceById(id);
};

export const checkOutAttendance = async (
    employeeId: string,
    meetingId: string 
) => {

    const attendance =
      await attendanceRepository.findActiveAttendance(
        employeeId,
        meetingId
      );

      if (!attendance) {
        throw new Error("Active attendance not found");
      }

      const checkOut = new Date();

      const workHours =
       (checkOut.getTime() - attendance.checkIn.getTime()) /
       (1000 * 60 * 60);

      attendance.checkOut = checkOut;
      attendance.workHours = workHours;
      attendance.status = "Present";

      const updateAttendance =
       await attendanceRepository.updateAttendance(
        attendance._id.toString(),
        {
          checkOut: attendance.checkOut,
          workHours: attendance.workHours,
          status: attendance.status,
        }
        
       );

    return updateAttendance; 
};
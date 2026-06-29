import Attendance from "../../models/hr/Attendance";

export const findAllAttendance = async () => {
  return await Attendance.find();
};

export const createAttendance = async (data: any) => {
  return await Attendance.create(data);
};

export const updateAttendance = async (
  id: string,
  data: any
) => {
  return await Attendance.findByIdAndUpdate(
    id,
    data,
    { 
      returnDocument: "after",
    }
  );
};


export const deleteAttendance = async (
  id: string
) => {
  return await Attendance.findByIdAndDelete(id);
};

export const findAttendanceById = async (
  id: string
) => {
  return await Attendance.findById(id);
};

export const findAttendanceByEmployeeAndMeeting = async (
    employeeId: string,
    meetingId: string
) => {
    console.log("Duplicate check:", {
        employeeId,
        meetingId,
  });

  const attendance = await Attendance.findOne({
    employeeId,
    meetingId,
    $or: [
      { checkOut: null },
      { checkOut: { $exists: false }}
    ]
  });

  console.log("Duplicate result:", attendance);

  return attendance;
};

export const findActiveAttendance = async (
    employeeId: string,
    meetingId: string
) => {
    console.log("Repository search:", {
        employeeId,
        meetingId,
    });

    const attendance = await Attendance.findOne({
        employeeId,
        meetingId,
        $or: [
            { checkOut: null },
            { checkOut: { $exists: false }},
        ],
        
    });
      console.log("Repository result:", attendance);

      return attendance;
         
};
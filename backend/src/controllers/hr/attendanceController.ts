import { Request, Response } from "express";
import * as attendanceService from "../../services/hr/attendanceService";
import Attendance from "../../models/hr/Attendance";

// Create Attendance
export const createAttendance = async (
  req: Request,
  res: Response
) => {
  try {
    const attendance = 
    await attendanceService.addAttendance(req.body);

    return res.status(201).json({
      success: true,
      message: "Attendance marked successfully",
      data: attendance,
    });
     } catch (error: any) {
       return res.status(500).json({
        success: false,
        message: error.message,
    });
  }
};

// Get All Attendance
export const getAttendance = async (
  req: Request,
  res: Response
) => {
  try {
    const attendance = 
    await attendanceService.getAllAttendance();

    return res.status(200).json({
      success: true,
      count: attendance.length,
      data: attendance,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Attendance
export const updateAttendance = async (
  req: Request,
  res: Response
) => {
  try {
    const attendance =
      await attendanceService.editAttendance(
        req.params.id as string,
        req.body
      );

      if (!attendance) {
        return res.status(404).json({
          success: false,
          message: "Attendance not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Attendance updated successfully",
        data: attendance,
      });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//checkOutAttendance
export const checkOutAttendance = async (
    req: Request,
    res: Response
) => {
    try {
        const attendance = await Attendance.findById(
            req.params.id
        );

        if (!attendance) {
            return res.status(404).json({
              success: false,
              message: "Attendance not found",
            });
        }

        if (!attendance.checkIn) {
          return res.status(400).json({
            success: false,
            message: "User has not checked in yet",
          });
        }

        const checkOut = new Date();

        const hours = 
         (checkOut.getTime() -
            attendance.checkIn.getTime()) /
         (1000 * 60 * 60);

         attendance.checkOut = checkOut;
         attendance.workHours =
          Math.round(hours * 100) / 100;

        await attendance.save();

        return res.status(200).json({
          success: true,
          message: "Checked out successfully",
          data: attendance,
          });
        } catch (error: any) {
          return res.status(500).json({
            success: false,
            message: error.message || "Check out failed",      
          });
        }
};

// Delete Attendance
export const deleteAttendance = async (
  req: Request,
  res: Response
) => {
  try {
    await attendanceService.removeAttendance(
      req.params.id as string
    );

    return res.status(200).json({
      success: true,
      message: "Attendance deleted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
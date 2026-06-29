import mongoose, { Schema, Document } from "mongoose";

export interface IAttendance extends Document {
    employeeId: string;
    meetingId: string;
    date: Date;
    checkIn: Date;
    checkOut: Date;
    status: string;
    workHours: number;
}

const attendanceSchema = new Schema(
    {
    employeeId: {
        type: String,
        required: true,
    },

    meetingId: {
      type: String,
      required: true,
    },

    date: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["Present", "Absent", "Late", "Half Day", "Leave"],
      default: "Present",
    },


    checkIn: {
      type: Date,
      default: Date.now,
    },

    checkOut: {
      type: Date,
      default: null,
    },

    workHours: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "Attendance",
  attendanceSchema
);



    

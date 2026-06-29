import mongoose, { Schema, Document } from "mongoose";

export interface ILeave extends Document {
  employeeId: string;
  leaveType: string;
  fromDate: Date;
  toDate: Date;
  reason: string;
  status: string;
}

const leaveSchema = new Schema(
  {
    employeeId: {
      type: String,
      required: true,
    },

    leaveType: {
      type: String,
      required: true,
      enum: [
        "Sick Leave",
        "Casual Leave",
        "Earned Leave",
        "Work From Home",
      ],
    },

    fromDate: {
      type: Date,
      required: true,
    },

    toDate: {
      type: Date,
      required: true,
    },

    reason: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Approved", "Rejected"],
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "Leave",
  leaveSchema
);
import mongoose, { Schema, Document } from "mongoose";

export interface IPayroll extends Document {
  employeeId: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  month: string;
  year: number;
  status: string;
}

const payrollSchema = new Schema(
  {
    employeeId: {
      type: String,
      required: true,
    },

    basicSalary: {
      type: Number,
      required: true,
    },

    allowances: {
      type: Number,
      default: 0,
    },

    deductions: {
      type: Number,
      default: 0,
    },

    netSalary: {
      type: Number,
      required: true,
    },

    month: {
      type: String,
      required: true,
    },

    year: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      default: "Pending", // Pending, Paid
    },
  },
  { timestamps: true }
);

export default mongoose.model<IPayroll>(
  "Payroll",
  payrollSchema
);
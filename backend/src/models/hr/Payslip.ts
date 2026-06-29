import mongoose, { Schema, Document } from "mongoose";

export interface IPayslip extends Document {
  employeeId: string;
  payrollId: string;
  month: string;
  year: number;
  grossSalary: number;
  deductions: number;
  netSalary: number;
  generatedDate: Date;
  status: string;
}

const payslipSchema = new Schema(
  {
    employeeId: {
      type: String,
      required: true,
    },

    payrollId: {
      type: String,
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

    grossSalary: {
      type: Number,
      required: true,
    },

    deductions: {
      type: Number,
      default: 0,
    },

    netSalary: {
      type: Number,
      required: true,
    },

    generatedDate: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      default: "Generated",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IPayslip>(
  "Payslip",
  payslipSchema
);
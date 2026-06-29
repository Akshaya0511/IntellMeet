import mongoose, { Schema, Document } from "mongoose";

export interface IEmployee extends Document {
    employeeId: string;
    firstName: string;
    lastName: string;
    email: string;
    department: string;
    designation: string;
    phone: string;
    joiningDate: Date;
    salary: number;
    status: string;
}

const employeeSchema = new Schema(
    {
        employeeId: {
            type: String,
            required: true,
            unique: true,
        },

        firstName: {
            type: String,
            required: true,
        },

        lastName: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
        },

        department: {
            type: String,
            required: true,
        },
        
        designation: {
            type: String,
            required: true,
        },

        phone: {
            type: String,
            default: "",
        },

        joiningDate: {
            type: Date,
            default: Date.now,
        },

        salary: {
            type: Number,
            required: true,
        },

        status: {
            type: String,
            default: "active",
        },
    },
    { timestamps: true }
);

export default mongoose.model(
    "Employee",
    employeeSchema
);
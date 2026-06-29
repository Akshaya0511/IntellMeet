import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: string;
  manager: string;
  isDeleted: boolean;
}

const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "Planning",
        "In Progress",
        "Completed",
        "On Hold",
      ],
      default: "Planning",
    },

    isDeleted: {
        type: Boolean,
        default: false,
    },

    manager: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IProject>(
  "Project",
  projectSchema
);
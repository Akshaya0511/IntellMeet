import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  projectId: string;
  title: string;
  description: string;
  assignedTo: string;
  createdBy: string;

  priority: "Low" | "Medium" | "High";
  status: "Todo" | "In Progress" | "Done";

  dueDate: Date;
  estimatedHours: number;
  actualHours: number;

  attachments: string[];
  labels: string[];
  comments: string[];
}

const taskSchema = new Schema(
  {
    projectId: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    assignedTo: {
      type: String,
      required: true,
    },

    createdBy: {
      type: String,
      required: true,
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    status: {
      type: String,
      enum: ["Todo", "In Progress", "Done"],
      default: "Todo",
    },

    dueDate: {
      type: Date,
    },

    estimatedHours: {
      type: Number,
      default: 0,
    },

    actualHours: {
      type: Number,
      default: 0,
    },

    attachments: {
      type: [String],
      default: [],
    },

    labels: {
      type: [String],
      default: [],
    },

    comments: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITask>(
  "ProjectTask",
  taskSchema
);
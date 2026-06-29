import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
    title: string;
    description?: string;
    projectId: string;
    assignee?: string;
    status: "Todo" | "In Progress" | "Done";
    priority: "Low" | "Medium" | "High";
    duoDate?: Date;
    attachments: string;
}

const taskSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
    }, 

       description : String,

       projectId: {
        type: String,
        required: true,
       },
    
       assignee: String,

       status: {
        type: String,
        enum: ["Todo", "In Progress", "Done"],
        default: "Todo",
       },

       priority: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "Medium",
       },

       attachments: {
        type: [String],
        default: [],
       },

       dueDate: Date,
    },

    

    { timestamps: true }
);

export default mongoose.model<ITask>(
    "Task",
    taskSchema
);
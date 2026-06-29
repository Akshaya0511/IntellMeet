import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        title: String,
        assignee: String,
        status: {
            type: String,
            default: "todo",        
        },
    }, 
    { timestamps: true }
);

export default mongoose.model(
    "Task",
    taskSchema
);
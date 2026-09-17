import mongoose, { Schema } from "mongoose";

const taskSchema = new mongoose.Schema({
    assignee: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    projectId: {
        type: Schema.Types.ObjectId,
        ref: "project"
    },
    status: {
        type: String,
        required: true,
        default: "toDo",
        enum: ["toDo", "inProgress", "completed"]
    },
    priority: {
        type: String,
        required: true,
        default: "medium",
        enum: ["low", "medium", "high"]
    }
})

const taskModel = mongoose.model("task", taskSchema);

export default taskModel
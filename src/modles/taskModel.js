import mongoose, { Schema } from "mongoose";

const taskSchema = new mongoose.Schema({
    assignee: {
        type: Schema.Types.ObjectId,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    projectId: {
        type: Schema.Types.ObjectId
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
import mongoose, { Schema } from "mongoose";

const projectSchema = new mongoose.Schema({
    admin: {
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
    status: {
        type: String,
        default: "inProgress",
        enum: ["inProgress", "completed"]
    },
    members: {
        type: [Schema.Types.ObjectId],
        ref: "user"
    },
    dueDate: {
        type: Date,
        required: true
    }
})

const projectModel = mongoose.model("project", projectSchema);

export default projectModel;
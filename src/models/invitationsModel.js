import mongoose, { Schema } from "mongoose";

const invitationSchema = new mongoose.Schema({
    projectId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'project'
    },
    senderId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    status: {
        type: String,
        default: "pending",
        enum: ["accepted", "rejected", "pending"]
    }
})

const invitationModel = mongoose.model("invitation", invitationSchema);

export default invitationModel
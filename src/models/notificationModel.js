import mongoose from "mongoose";
import { Schema } from "mongoose";

const notificationSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "user"
    },
    message: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true
})

const notificationModel = mongoose.model("notification", notificationSchema);

export default notificationModel
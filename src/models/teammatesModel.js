import mongoose, { Schema } from 'mongoose'

const teamMatesSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
        unique: true
    },
    recentTeamMates: {
        type: [Schema.Types.ObjectId],
        default: [],
        ref: "user"
    }
})

const teamMatesModel = mongoose.model('teamMates', teamMatesSchema);

export default teamMatesModel;
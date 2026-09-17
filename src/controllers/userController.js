// GET /api/users?search=...
// Matches fullName, email, or userId. Never returns the current user

import teamMatesModel from "../models/teammatesModel.js";
import userModel from "../models/userModel.js";

// (you don't invite yourself) or passwords.
export const searchUsers = async (req, res, next) => {
    try {
        const { search } = req.query;

        if (search === '') return res.status(200).json({
            message: "Users fetched successfully",
            success: true,
            users: null
        });

        let results = [];
        console.log(req.user);
        if (search) {
            results = await userModel.find({
                _id: { $ne: req.user },

                $or: [
                    { fullName: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } },
                    { userId: { $regex: search, $options: "i" } },
                ],
            }).select("-password");
        }

        res.status(200).json({
            message: "Users fetched successfully",
            success: true,
            users: results
        });
    } catch (err) {
        next(err);
    }
};

// GET /api/users/recent
// "Recent teammates" = people who already share a project with you — a simple,
// real-data-backed stand-in for a full activity feed, useful for quick-adding
// to a new invitation.
export const getRecentTeammates = async (req, res, next) => {
    try {
        const userId = req.user;

        const recentTeamMates = await teamMatesModel.findOne({ userId }).populate("recentTeamMates");

        if (!recentTeamMates || recentTeamMates.length < 1) return res.status(200).json({
            message: "No recent Team mates available",
            success: true
        })

        res.status(200).json({
            message: "Recent teammates fetched successfully",
            success: true,
            recentTeammates: recentTeamMates
        });
    } catch (err) {
        next(err);
    }
};

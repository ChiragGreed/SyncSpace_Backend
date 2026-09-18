import teamMatesModel from "../models/teammatesModel.js";
import userModel from "../models/userModel.js";

/**
 * @route GET /api/users/?search=...
 * Search users by name, email, or user ID without returning the current user or passwords.
 */
export const searchUsers = async (req, res, next) => {
    try {
        const { search } = req.query;

        if (search === '') return res.status(200).json({
            message: "Users fetched successfully",
            success: true,
            users: null
        });

        let results = [];
        
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

/**
 * @route GET /api/users/recent
 * Return teammates previously associated with the authenticated user's projects.
 */
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

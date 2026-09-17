import notificationModel from "../models/notificationModel.js";

// GET /api/notifications
export const getNotifications = async (req, res, next) => {
    try {
        const userId = req.user;
        const userNotifications = await notificationModel.find({ userId }).sort({ createdAt: -1 });

        res.status(200).json({
            message: "Notifications fetched successfully",
            success: true,
            notifications: userNotifications
        });
    } catch (err) {
        next(err);
    }
};

// PATCH /api/notifications/:notificationId/read
export const markNotificationRead = async (req, res, next) => {
    try {
        const { notificationId } = req.params;
        const userId = req.user;

        const notification = await notificationModel.findById(notificationId);

        if (!notification) return res.status(404).json({
            message: `Notification does not exist with id ${notificationId}`,
            success: false
        });

        if (notification.userId.toString() !== userId) return res.status(403).json({
            message: "You cannot modify another user's notification",
            success: false
        });

        notification.isRead = true;
        await notification.save();

        res.status(200).json({
            message: "Notification marked as read",
            success: true,
            notification
        });
    } catch (err) {
        next(err);
    }
};

// PATCH /api/notifications/read-all
export const markAllNotificationsRead = async (req, res, next) => {
    try {
        const userId = req.user;
        const notification = await notificationModel.updateMany({ userId }, { isRead: true });

        res.status(200).json({
            message: "All notifications marked as read",
            success: true,
            updatedCount: notification.updatedCount
        });
    } catch (err) {
        next(err);
    }
};

// DELETE /api/notifications/:notificationId
export const deleteNotification = async (req, res, next) => {
    try {
        const { notificationId } = req.params;
        const userId = req.user;

        const notification = await notificationModel.findById(notificationId);

        if (!notification) return res.status(404).json({
            message: `Notification does not exist with id ${notificationId}`,
            success: false
        });

        if (notification.userId.toString() !== userId) return res.status(403).json({
            message: "You cannot delete another user's notification",
            success: false
        });

        await notification.deleteOne();

        res.status(204).send();
    } catch (err) {
        next(err);
    }
};

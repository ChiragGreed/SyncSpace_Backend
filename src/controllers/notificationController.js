import { notifications } from "../mockData.js";

// GET /api/notifications
export const getNotifications = (req, res, next) => {
    try {
        const userId = req.user;
        const userNotifications = notifications
            .filter(notification => notification.userId === userId)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

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
export const markNotificationRead = (req, res, next) => {
    try {
        const { notificationId } = req.params;
        const userId = req.user;

        const notification = notifications.find(notification => notification.notificationId === notificationId);

        if (!notification) return res.status(404).json({
            message: `Notification does not exist with id ${notificationId}`,
            success: false
        });

        if (notification.userId !== userId) return res.status(403).json({
            message: "You cannot modify another user's notification",
            success: false
        });

        notification.isRead = true;

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
export const markAllNotificationsRead = (req, res, next) => {
    try {
        const userId = req.user;
        let updatedCount = 0;

        notifications.forEach(notification => {
            if (notification.userId === userId && !notification.isRead) {
                notification.isRead = true;
                updatedCount++;
            }
        });

        res.status(200).json({
            message: "All notifications marked as read",
            success: true,
            updatedCount
        });
    } catch (err) {
        next(err);
    }
};

// DELETE /api/notifications/:notificationId
export const deleteNotification = (req, res, next) => {
    try {
        const { notificationId } = req.params;
        const userId = req.user;

        const index = notifications.findIndex(notification => notification.notificationId === notificationId);

        if (index === -1) return res.status(404).json({
            message: `Notification does not exist with id ${notificationId}`,
            success: false
        });

        if (notifications[index].userId !== userId) return res.status(403).json({
            message: "You cannot delete another user's notification",
            success: false
        });

        notifications.splice(index, 1);

        res.status(204).send();
    } catch (err) {
        next(err);
    }
};

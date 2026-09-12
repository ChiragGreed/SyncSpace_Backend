import express from 'express';
import { getNotifications, markNotificationRead, markAllNotificationsRead, deleteNotification } from '../controllers/notificationController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const notificationRouter = express.Router();

notificationRouter.use(verifyToken);

notificationRouter.get('/', getNotifications);
notificationRouter.patch('/read-all', markAllNotificationsRead);
notificationRouter.patch('/:notificationId/read', markNotificationRead);
notificationRouter.delete('/:notificationId', deleteNotification);

export default notificationRouter;

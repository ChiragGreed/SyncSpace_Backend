import express from 'express';
import { createTask, deleteTask, getTasks, getTask, getProjectTasks, updateTask, updateTaskStatus } from '../controllers/taskController.js';
import { validateCreateTask, validateUpdateTask, validateTaskStatus } from '../middlewares/validateMiddleware.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const taskRouter = express.Router();

taskRouter.get('/', verifyToken, getTasks);

taskRouter.get('/:taskId', verifyToken, getTask);

taskRouter.get('/:projectId', verifyToken, getProjectTasks);

taskRouter.post('/', verifyToken, validateCreateTask, createTask);

taskRouter.patch('/:taskId', verifyToken, validateUpdateTask, updateTask);

taskRouter.patch('/:taskId/status', verifyToken, validateTaskStatus, updateTaskStatus);

taskRouter.delete('/:taskId', verifyToken, deleteTask);

export default taskRouter;

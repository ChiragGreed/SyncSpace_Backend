import express from 'express';
import { createProject, getProjects, getProject, updateProject, deleteProject, updateProjectStatus, getProjectTasks } from '../controllers/projectController.js';
import { validateCreateProject, validateProjectStatus, validateUpdateProject } from '../middlewares/validateMiddleware.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const projectRouter = express.Router();

projectRouter.get('/', verifyToken, getProjects);

projectRouter.get('/:projectId', verifyToken, getProject);

projectRouter.get('/:projectId/task', verifyToken, getProjectTasks);

projectRouter.post('/', verifyToken, validateCreateProject, createProject);

projectRouter.patch('/:projectId', verifyToken, validateUpdateProject, updateProject);

projectRouter.patch('/:projectId/status', verifyToken, validateProjectStatus, updateProjectStatus);

projectRouter.delete('/:projectId', verifyToken, deleteProject);

export default projectRouter;

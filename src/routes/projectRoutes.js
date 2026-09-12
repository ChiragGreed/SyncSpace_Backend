import express from 'express';
import { createProject, getProjects, getProject, updateProject, deleteProject } from '../controllers/projectController.js';
import { validateCreateProject, validateUpdateProject } from '../middlewares/validateMiddleware.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const projectRouter = express.Router();

projectRouter.get('/', verifyToken, getProjects);

projectRouter.get('/:projectId', verifyToken, getProject);

projectRouter.post('/', verifyToken, validateCreateProject, createProject);

projectRouter.patch('/:projectId', verifyToken, validateUpdateProject, updateProject);

projectRouter.delete('/:projectId', verifyToken, deleteProject);

export default projectRouter;

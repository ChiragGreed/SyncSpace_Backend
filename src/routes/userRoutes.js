import express from 'express';
import { searchUsers, getRecentTeammates } from '../controllers/userController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const userRouter = express.Router();

userRouter.use(verifyToken);

userRouter.get('/recent', getRecentTeammates);
userRouter.get('/', searchUsers);

export default userRouter;

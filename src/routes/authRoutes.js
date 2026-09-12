import express from 'express';
import { getMe, login, register } from '../controllers/authController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { validateLogin, validateRegister } from '../middlewares/validateMiddleware.js';

const authRouter = express.Router();

authRouter.post('/register', validateRegister, register);

authRouter.post('/login', validateLogin, login);

authRouter.get('/', verifyToken, getMe);

export default authRouter;

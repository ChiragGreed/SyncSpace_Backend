import express from "express";
import taskRouter from "./routes/taskRoutes.js";
import authRouter from "./routes/authRoutes.js";
import projectRouter from "./routes/projectRoutes.js";
import userRouter from "./routes/userRoutes.js";
import invitationRouter from "./routes/invitationRoutes.js";
import notificationRouter from "./routes/notificationRoutes.js";
import cookieParser from "cookie-parser";
import { notFoundHandler, errorHandler } from "./middlewares/errorMiddleware.js";


const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/tasks', taskRouter);
app.use('/api/projects', projectRouter);
app.use('/api/users', userRouter);
app.use('/api/invitations', invitationRouter);
app.use('/api/notifications', notificationRouter);

// Must come after all routes.
app.use(notFoundHandler);
app.use(errorHandler);

export default app;

import express from 'express';
import { createInvitations, getReceivedInvitations, getSentInvitations, respondToInvitation } from '../controllers/invitationController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { validateCreateInvitations, validateInvitationStatus } from '../middlewares/validateMiddleware.js';

const invitationRouter = express.Router();

invitationRouter.use(verifyToken);

invitationRouter.get('/received', getReceivedInvitations);
invitationRouter.get('/sent', getSentInvitations);
invitationRouter.post('/', validateCreateInvitations, createInvitations);
invitationRouter.patch('/:invitationId', validateInvitationStatus, respondToInvitation);

export default invitationRouter;

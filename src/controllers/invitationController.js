import projectModel from "../models/projectModel.js"
import userModel from "../models/userModel.js"
import invitationModel from "../models/invitationsModel.js";
import notificationModel from "../models/notificationModel.js";
import teamMatesModel from "../models/teammatesModel.js";

/**
 * @route POST /api/invitations
 * Create invitations for eligible users and notify each new recipient.
 * Existing project members may invite others; invalid recipients are reported
 * in the skipped list so one invalid entry does not fail the whole request.
 */
export const createInvitations = async (req, res, next) => {
    try {
        const senderId = req.user;
        const { projectId, receiversId } = req.body;

        const project = await projectModel.findById(projectId);

        if (!project) return res.status(404).json({
            message: `Project does not exist with id ${projectId}`,
            success: false
        });

        if (!project.members.includes(senderId)) return res.status(403).json({
            message: "Only existing project members can send invitations",
            success: false
        });

        const created = [];
        const skipped = [];

        await Promise.all(receiversId.map(async (receiverId) => {
            const receiver = await userModel.findById(receiverId);
            const sender = await userModel.findById(senderId);

            if (!receiver) {
                skipped.push({ userId: receiverId, reason: "User does not exist" });
                return;
            }
            if (receiverId === senderId) {
                skipped.push({ userId: receiverId, reason: "Cannot invite yourself" });
                return;
            }
            if (project.members.includes(receiverId)) {
                skipped.push({ userId: receiverId, reason: "User is already a project member" });
                return;
            }
            const duplicatePending = await invitationModel.find({ $and: [{ projectId: projectId }, { receiverId: receiverId }, { status: "pending" }] });

            if (duplicatePending.length > 0) {
                skipped.push({ userId: receiverId, reason: "A pending invitation already exists for this user" });
                return;
            }
            const invitation = await invitationModel.create({ projectId, senderId, receiverId, status: "pending", });
            created.push(invitation);

            const temp = await notificationModel.create({ userId: receiverId, message: `${sender?.fullName ?? "Someone"} invited you to join project: "${project.title}"` });
        }));

        res.status(201).json({
            message: "Invitations processed",
            success: true,
            created,
            skipped
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @route GET /api/invitations/received
 * Return the authenticated user's pending received invitations.
 */
export const getReceivedInvitations = async (req, res, next) => {
    try {
        const userId = req.user;
        const received = await invitationModel.find({ receiverId: userId, status: "pending" });

        if (!received || received.length < 1) return res.status(200).json({
            message: "No invitations received",
            success: true
        })

        res.status(200).json({
            message: "Received invitations fetched successfully",
            success: true,
            invitations: received
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @route GET /api/invitations/sent
 * Return all invitations sent by the authenticated user.
 */
export const getSentInvitations = async (req, res, next) => {
    try {
        const userId = req.user;
        const sent = await invitationModel.find({ senderId: userId });

        if (!sent || sent.length < 1) return res.status(200).json({
            message: "No invitations sent",
            success: true
        })

        res.status(200).json({
            message: "Sent invitations fetched successfully",
            success: true,
            invitations: sent
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @route PATCH /api/invitations/:invitationId
 * Accept or reject a pending invitation owned by the authenticated receiver.
 * Acceptance adds the user to the project and records a recent teammate.
 */
export const respondToInvitation = async (req, res, next) => {
    try {
        const { invitationId } = req.params;
        const { status } = req.body;
        const userId = req.user;

        const invitation = await invitationModel.findById(invitationId).populate(['projectId', 'receiverId']);

        if (!invitation) return res.status(404).json({
            message: `Invitation does not exist with id ${invitationId}`,
            success: false
        });

        if (invitation.receiverId._id.toString() !== userId) return res.status(403).json({
            message: "Only the invited user can respond to this invitation",
            success: false
        });

        if (invitation.status !== "pending") return res.status(400).json({
            message: `Invitation has already been ${invitation.status}`,
            success: false
        });

        const project = invitation.projectId;
        const receiver = invitation.receiverId;

        if (status === "accepted") {
            if (project && !project.members.includes(receiver._id)) {
                project.members.push(invitation.receiverId);
            }

            await notificationModel.create({ userId: invitation.senderId, message: `${invitation.receiverId?.fullName ?? "Someone"} accepted your invitation to join project: "${project?.title ?? "the project"}"` });

            await teamMatesModel.findOneAndUpdate({ userId: invitation.senderId }, { $addToSet: { recentTeamMates: receiver._id } }, { upsert: true, new: true });

        } else {
            await notificationModel.create({ userId: invitation.senderId, message: `${invitation.receiverId?.fullName ?? "Someone"} declined your invitation to join project: "${project?.title ?? "the project"}"` });
        }

        invitation.status = status;

        await invitation.save();
        await project.save();

        res.status(200).json({
            message: `Invitation ${status} successfully`,
            success: true,
            invitation
        });
    } catch (err) {
        next(err);
    }
};

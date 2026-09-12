import { invitations, projects, users, notifications } from "../mockData.js";
import crypto from "crypto";

const createNotification = (userId, type, invitationId, message) => {
    const notification = {
        notificationId: crypto.randomUUID(),
        userId,
        type,
        invitationId,
        message,
        isRead: false,
        createdAt: new Date().toISOString()
    };
    notifications.push(notification);
    return notification;
};

// POST /api/invitations
// Body: { projectId, userIds: [...] }
// Only an existing project member can invite others. Invalid targets in the
// batch (nonexistent user, self, already a member, duplicate pending invite)
// are skipped individually rather than failing the whole request.
export const createInvitations = (req, res, next) => {
    try {
        const senderId = req.user;
        const { projectId, userIds } = req.body;

        const project = projects.find(project => project.projectId === projectId);

        if (!project) return res.status(404).json({
            message: `Project does not exist with id ${projectId}`,
            success: false
        });
       
        if (!project.members.includes(senderId)) return res.status(403).json({
            message: "Only existing project members can send invitations",
            success: false
        });

        const sender = users.find(user => user.userId === senderId);

        const created = [];
        const skipped = [];

        const uniqueUserIds = [...new Set(userIds)];

        uniqueUserIds.forEach(receiverId => {
            const receiver = users.find(user => user.userId === receiverId);

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
            const duplicatePending = invitations.find(invitation =>
                invitation.projectId === projectId &&
                invitation.receiverId === receiverId &&
                invitation.status === "pending"
            );
            if (duplicatePending) {
                skipped.push({ userId: receiverId, reason: "A pending invitation already exists for this user" });
                return;
            }

            const invitation = {
                invitationId: crypto.randomUUID(),
                projectId,
                senderId,
                receiverId,
                status: "pending",
                createdAt: new Date().toISOString()
            };
            invitations.push(invitation);
            created.push(invitation);

            createNotification(
                receiverId,
                "invitation_received",
                invitation.invitationId,
                `${sender?.fullName ?? "Someone"} invited you to join "${project.title}"`
            );
        });

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

// GET /api/invitations/received
export const getReceivedInvitations = (req, res, next) => {
    try {
        const receiverId = req.user;
        const received = invitations.filter(invitation => invitation.receiverId === receiverId);

        res.status(200).json({
            message: "Received invitations fetched successfully",
            success: true,
            invitations: received
        });
    } catch (err) {
        next(err);
    }
};

// GET /api/invitations/sent
export const getSentInvitations = (req, res, next) => {
    try {
        const senderId = req.user;
        const sent = invitations.filter(invitation => invitation.senderId === senderId);

        res.status(200).json({
            message: "Sent invitations fetched successfully",
            success: true,
            invitations: sent
        });
    } catch (err) {
        next(err);
    }
};

// PATCH /api/invitations/:invitationId
// Body: { status: "accepted" | "rejected" }
// Only the receiver can respond, and only while the invitation is still pending.
export const respondToInvitation = (req, res, next) => {
    try {
        const { invitationId } = req.params;
        const { status } = req.body;
        const currentUserId = req.user;

        const invitation = invitations.find(invitation => invitation.invitationId === invitationId);

        if (!invitation) return res.status(404).json({
            message: `Invitation does not exist with id ${invitationId}`,
            success: false
        });

        if (invitation.receiverId !== currentUserId) return res.status(403).json({
            message: "Only the invited user can respond to this invitation",
            success: false
        });

        if (invitation.status !== "pending") return res.status(400).json({
            message: `Invitation has already been ${invitation.status}`,
            success: false
        });

        const project = projects.find(project => project.projectId === invitation.projectId);
        const receiver = users.find(user => user.userId === invitation.receiverId);

        invitation.status = status;

        if (status === "accepted") {
            if (project && !project.members.includes(invitation.receiverId)) {
                project.members.push(invitation.receiverId);
            }
            createNotification(
                invitation.senderId,
                "invitation_accepted",
                invitation.invitationId,
                `${receiver?.fullName ?? "Someone"} accepted your invitation to join "${project?.title ?? "the project"}"`
            );
        } else {
            createNotification(
                invitation.senderId,
                "invitation_rejected",
                invitation.invitationId,
                `${receiver?.fullName ?? "Someone"} declined your invitation to join "${project?.title ?? "the project"}"`
            );
        }

        res.status(200).json({
            message: `Invitation ${status} successfully`,
            success: true,
            invitation
        });
    } catch (err) {
        next(err);
    }
};

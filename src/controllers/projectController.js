import { projects } from "../mockData.js";
import crypto from "crypto";
import projectModel from "../modles/projectModel.js";

export const createProject = async (req, res, next) => {
    try {
        const userId = req.user;
        const admin = userId;

        const { title, description, status, dueDate } = req.body;

        let members = req.body.members || [];
        members.push(userId);

        const project = await projectModel.create({ admin, title, description, status, dueDate, members });

        res.status(201).json({
            message: "Project created successfully",
            success: true,
            project
        })
    } catch (err) {
        next(err);
    }
}

export const getProjects = (req, res, next) => {
    try {
        res.status(200).json({
            message: "Projects fetched successfully",
            success: true,
            projects
        })
    } catch (err) {
        next(err);
    }
}

export const getProject = (req, res, next) => {
    try {
        const { projectId } = req.params;

        const project = projects.find(project => project.projectId === projectId);

        if (!project) return res.status(404).json({
            message: `Project does not exist with id ${projectId}`,
            success: false
        })

        res.status(200).json({
            message: "Project fetched successfully",
            success: true,
            project
        })
    } catch (err) {
        next(err);
    }
}

export const updateProject = (req, res, next) => {
    try {
        const { projectId } = req.params;

        const project = projects.find(project => project.projectId === projectId);

        if (!project) return res.status(404).json({
            message: `Project does not exist with id ${projectId}`,
            success: false
        })

        Object.assign(project, req.body);

        res.status(200).json({
            message: "Project updated successfully",
            success: true,
            project
        })
    } catch (err) {
        next(err);
    }
}

export const deleteProject = (req, res, next) => {
    try {
        const { projectId } = req.params;
        const projectIndex = projects.findIndex(project => project.projectId === projectId);

        if (projectIndex === -1) return res.status(404).json({
            message: "Project does not exist",
            success: false
        })

        projects.splice(projectIndex, 1);

        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

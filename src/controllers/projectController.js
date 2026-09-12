import { projects } from "../mockData.js";
import crypto from "crypto";

export const createProject = (req, res, next) => {
    try {
        const { title, description, status = "inProgress", dueDate } = req.body;

        const projectId = crypto.randomUUID();
        const newProject = { projectId, title, description, status, dueDate, members: [req.user], taskList: [] };

        projects.push(newProject);

        res.status(201).json({
            message: "Project created successfully",
            success: true,
            project: newProject
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

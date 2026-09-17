import taskModel from "../models/taskModel.js";
import projectModel from "../models/projectModel.js";

export const createProject = async (req, res, next) => {
    try {
        const userId = req.user;
        const admin = userId;

        const { title, description, status, dueDate } = req.body;

        const project = await projectModel.create({ admin, title, description, status, dueDate, members: [userId] });

        res.status(201).json({
            message: "Project created successfully",
            success: true,
            project
        })
    } catch (err) {
        next(err);
    }
}

export const getProjects = async (req, res, next) => {
    try {
        const userId = req.user;

        const projects = await projectModel.find({ members: userId });

        if (!projects || projects.length === 0) return res.status(200).json({
            message: "No projects to show",
            success: true
        })

        res.status(200).json({
            message: "Projects fetched successfully",
            success: true,
            projects
        })
    } catch (err) {
        next(err);
    }
}

export const getProject = async (req, res, next) => {
    try {
        const { projectId } = req.params;

        const project = await projectModel.findById(projectId);

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

export const getProjectTasks = async (req, res, next) => {
    try {
        const { projectId } = req.params;
        const tasks = await taskModel.find({ projectId });

        if (!tasks || tasks.length === 0) return res.status(404).json({
            message: `No tasks found for project with id ${projectId}`,
            success: false
        });

        res.status(200).json({
            message: "Project Tasks fetched successfully",
            success: true,
            tasks
        })

    } catch (err) {
        next(err);
    }
}

export const updateProject = async (req, res, next) => {
    try {
        const { projectId } = req.params;
        const userId = req.user;
        const project = await projectModel.findById(projectId);

        if (!project) return res.status(404).json({
            message: `Project does not exist with id ${projectId}`,
            success: false
        })

        if (!(project.admin.toString() === userId.toString()))
            return res.status(403).json({
                message: "Only project admin can update this project",
                success: false
            })

        await project.updateOne(req.body);


        res.status(200).json({
            message: "Project updated successfully",
            success: true,
            project
        })
    } catch (err) {
        next(err);
    }
}

export const updateProjectStatus = async (req, res, next) => {
    try {
        const { projectId } = req.params;
        const { status } = req.body;
        const userId = req.user;

        const project = await projectModel.findById(projectId);

        if (!project) return res.status(404).json({
            message: `Project does not exist with id ${projectId}`,
            success: false
        })

        if (!(project.admin.toString() === userId.toString()))
            return res.status(403).json({
                message: "Only project admin can update this project",
                success: false
            })

        project.status = status;
        await project.save();

        res.status(200).json({
            message: "Project updated successfully",
            success: true,
            project
        })
    } catch (err) {
        next(err);
    }
}

export const deleteProject = async (req, res, next) => {
    try {
        const userId = req.user;
        const { projectId } = req.params;

        const project = await projectModel.findById(projectId);

        if (!project) return res.status(404).json({
            message: `Project does not exist with id ${projectId}`,
            success: false
        })

        if (!(project.admin.toString() === userId.toString()))
            return res.status(403).json({
                message: "Only project admin can update this project",
                success: false
            })

        await project.deleteOne({ projectId });

        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

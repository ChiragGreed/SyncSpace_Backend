import { tasks } from '../mockData.js';
import crypto from 'crypto';
import taskModel from '../modles/TaskModel.js';
import projectModel from '../modles/projectModel.js';

export const createTask = async (req, res, next) => {
    try {
        const userId = req.user;

        // projectId is optional in task creation, to create individual tasks separate from any project.
        const { title, projectId, description, status, priority, assignee = userId } = req.body;

        const task = await taskModel.create({ title, description, projectId, assignee, status, priority });

        res.status(201).json({
            message: "Task created successfully",
            success: true,
            task
        })
    } catch (err) {
        next(err);
    }
}

export const deleteTask = async (req, res, next) => {
    try {
        const { taskId } = req.params;
        const taskIndex = await taskModel.findOneAndDelete(taskId);

        if (!taskIndex) return res.status(404).json({
            message: "Task do not exist",
            success: false
        })

        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

// Get all 'your' tasks from all projects
export const getTasks = async (req, res, next) => {
    try {
        const userId = req.user;
        const tasks = await taskModel.find({ assignee: userId });

        if (tasks.length < 1) return res.status(200).json({
            message: "No tasks to show",
            success: true
        })

        res.status(200).json({
            message: "Tasks fetched successfully",
            success: true,
            tasks
        });
    } catch (err) {
        next(err);
    }
}

// Get all tasks from a project
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

// Get single tasks
export const getTask = async (req, res, next) => {
    try {
        const { taskId } = req.params;

        const task = await taskModel.findOne({ _id: taskId });

        if (!task) return res.status(404).json({
            message: `Task do not exist with ${taskId}`,
            success: false,
        })

        res.status(200).json({
            message: "Task fetched successfully",
            success: true,
            task
        });
    } catch (err) {
        next(err);
    }
}

export const updateTask = async (req, res, next) => {
    try {

        const { taskId } = req.params;
        const userId = req.user;

        const existingTask = await taskModel.findOne({ _id: taskId });

        if (!existingTask) return res.status(404).json({
            message: `Task do not exist with ${taskId}`,
            success: false,
        })

        // Check if task belongs to a project
        if (existingTask.projectId) {

            const project = await projectModel.findOne({ _id: existingTask.projectId });

            if (!project) return res.status(404).json({
                message: "Project does not exist",
                success: false,
            })

            // Check if user is project admin
            if (project.admin.toString() !== userId.toString()) return res.status(403).json({
                message: "Only the project admin can update this task",
                success: false,
            })
        }

        else {
            // Check if task belongs to a this user
            if (existingTask.assignee.toString() !== userId.toString()) return res.status(403).json({
                message: "Task assigned to another user",
                success: false
            })
        }

        const task = await taskModel.findByIdAndUpdate({ _id: taskId }, req.body);

        res.status(200).json({
            message: "Task updated successfully",
            success: true,
            task
        })
    } catch (err) {
        next(err);
    }
}

export const updateTaskStatus = async (req, res, next) => {
    try {
        const userId = req.user;
        const { taskId } = req.params;
        const { status } = req.body;

        const task = await taskModel.findById(taskId);

        if (!task) return res.status(404).json({
            message: `Task do not exist with ${taskId}`,
            success: false,
        })

        if (task.assignee.toString() !== userId.toString()) return res.status(403).json({
            message: "Task assigned to another user",
            success: false
        })

        task.status = status;
        await task.save();

        res.status(200).json({
            message: "Task status updated successfully",
            success: true,
            task
        })
    } catch (err) {
        next(err);
    }
}

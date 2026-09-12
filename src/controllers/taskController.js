import { tasks } from '../mockData.js';
import crypto from 'crypto';

export const createTask = (req, res, next) => {
    try {
        // projectId is optional in task creation, to create individual tasks separate from any project.
        const { title, projectId, description, status = "toDo", priority = "medium" } = req.body;

        const taskId = crypto.randomUUID();
        const newTask = { taskId, projectId, title, description, status, priority };

        tasks.push(newTask);

        res.status(201).json({
            message: "Task created successfully",
            success: true,
            task: newTask
        })
    } catch (err) {
        next(err);
    }
}

export const deleteTask = (req, res, next) => {
    try {
        const { taskId } = req.params;
        const taskIndex = tasks.findIndex(task => task.taskId === taskId);

        if (taskIndex === -1) return res.status(404).json({
            message: "Task do not exist",
            success: false
        })

        tasks.splice(taskIndex, 1);

        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

export const getTasks = (req, res, next) => {
    try {
        res.status(200).json({
            message: "Tasks fetched successfully",
            success: true,
            tasks
        });
    } catch (err) {
        next(err);
    }
}

export const getTask = (req, res, next) => {
    try {
        const { taskId } = req.params;

        const task = tasks.find(task => task.taskId === taskId);

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

export const updateTask = (req, res, next) => {
    try {
        const { taskId } = req.params;

        const task = tasks.find(task => task.taskId === taskId);

        if (!task) return res.status(404).json({
            message: `Task do not exist with ${taskId}`,
            success: false,
        })

        Object.assign(task, req.body);

        res.status(200).json({
            message: "Task updated successfully",
            success: true,
            task
        })
    } catch (err) {
        next(err);
    }
}

export const updateTaskStatus = (req, res, next) => {
    try {
        const { taskId } = req.params;
        const { status } = req.body;

        const task = tasks.find(task => task.taskId === taskId);

        if (!task) return res.status(404).json({
            message: `Task do not exist with ${taskId}`,
            success: false,
        })

        task.status = status;

        res.status(200).json({
            message: "Task status updated successfully",
            success: true,
            task
        })
    } catch (err) {
        next(err);
    }
}

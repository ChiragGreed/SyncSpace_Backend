import taskModel from "../models/taskModel.js";
import projectModel from "../models/projectModel.js";

/**
 * @route POST /api/tasks/
 * Create a task, assigning it to the requested user or the authenticated user by default.
 */
export const createTask = async (req, res, next) => {
    try {
        const userId = req.user;

        // projectId is optional in task creation, to create individual tasks separate from any project.
        const { title, projectId, description, status, priority, assignee = userId } = req.body;

        if (projectId) {
            const project = await projectModel.findById(projectId);

            if (!project) return res.status(404).json({
                message: `Project does not exist with id ${projectId}`,
                success: false
            })
        }
        
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

/**
 * @route DELETE /api/tasks/:taskId
 * Delete a task by ID.
 */
export const deleteTask = async (req, res, next) => {
    try {
        const { taskId } = req.params;
        const taskIndex = await taskModel.findOneAndDelete({ _id: taskId });

        if (!taskIndex) return res.status(404).json({
            message: "Task do not exist",
            success: false
        })

        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

/**
 * @route GET /api/tasks/
 * Return all tasks assigned to the authenticated user.
 */
export const getTasks = async (req, res, next) => {
    try {
        const userId = req.user;
        const tasks = await taskModel.find({ assignee: userId });

        if (!tasks || tasks.length < 1) return res.status(200).json({
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

/**
 * @route GET /api/tasks/:taskId
 * Return one task by ID.
 */
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

/**
 * @route PATCH /api/tasks/:taskId
 * Update a task when the caller has project-admin or assignee permissions.
 */
export const updateTask = async (req, res, next) => {
    try {

        const { taskId } = req.params;
        const userId = req.user;

        const existingTask = await taskModel.findOne({ _id: taskId }).populate("projectId");
        console.log(existingTask);
        const project = existingTask?.projectId;

        if (!existingTask) return res.status(404).json({
            message: `Task do not exist with ${taskId}`,
            success: false,
        })

        // Check if task belongs to a project
        if (project) {

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

/**
 * @route PATCH /api/tasks/:taskId/status
 * Update a task's status when the authenticated user is its assignee.
 */
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

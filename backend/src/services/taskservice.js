import mongoose from "mongoose";
import Task from "../models/task.js";
import ApiError from "../utils/apiError.js";

const ALLOWED_SORT_FIELDS = new Set(["createdAt", "dueDate"]);
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizePagination = (page, limit) => ({
    page: Number.isInteger(page) && page > 0 ? page : DEFAULT_PAGE,
    limit: Number.isInteger(limit) && limit > 0 ? Math.min(limit, MAX_LIMIT) : DEFAULT_LIMIT,
});

const buildSortObject = (sortBy, sortOrder) => {
    const field = ALLOWED_SORT_FIELDS.has(sortBy) ? sortBy : "createdAt";
    const direction = sortOrder === "asc" ? 1 : -1;

    return { [field]: direction };
};

const ensureTaskId = (taskId) => {
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
        throw new ApiError(400, "Invalid task id");
    }
};

export const createTask = async (userId, taskData) => {
    const task = await Task.create({
        title: taskData.title,
        description: taskData.description || "",
        status: taskData.status || "todo",
        priority: taskData.priority || "medium",
        dueDate: taskData.dueDate || null,
        createdBy: userId,
        completedAt: taskData.status === "completed" ? new Date() : null,
    });

    return task;
};

export const getTasks = async (userId, queryParams) => {
    const { page, limit } = normalizePagination(queryParams.page, queryParams.limit);
    const filter = { createdBy: userId };

    if (queryParams.search) {
        filter.title = {
            $regex: escapeRegExp(queryParams.search),
            $options: "i",
        };
    }

    if (queryParams.status) {
        filter.status = queryParams.status;
    }

    if (queryParams.priority) {
        filter.priority = queryParams.priority;
    }

    const sort = buildSortObject(queryParams.sortBy, queryParams.sortOrder);
    const skip = (page - 1) * limit;

    const [tasks, totalTasks] = await Promise.all([
        Task.find(filter).sort(sort).skip(skip).limit(limit).lean(),
        Task.countDocuments(filter),
    ]);

    const totalPages = Math.max(Math.ceil(totalTasks / limit), 1);

    return {
        tasks,
        pagination: {
            totalTasks,
            totalPages,
            page,
            limit,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
        },
    };
};

export const getTaskById = async (userId, taskId) => {
    ensureTaskId(taskId);

    const task = await Task.findOne({ _id: taskId, createdBy: userId });

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    return task;
};

export const updateTask = async (userId, taskId, updates) => {
    ensureTaskId(taskId);

    const task = await Task.findOne({ _id: taskId, createdBy: userId });

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    const previousStatus = task.status;

    if (updates.title !== undefined) {
        task.title = updates.title;
    }

    if (updates.description !== undefined) {
        task.description = updates.description;
    }

    if (updates.priority !== undefined) {
        task.priority = updates.priority;
    }

    if (updates.dueDate !== undefined) {
        task.dueDate = updates.dueDate;
    }

    if (updates.status !== undefined) {
        task.status = updates.status;

        if (previousStatus !== "completed" && updates.status === "completed") {
            task.completedAt = new Date();
        }

        if (previousStatus === "completed" && updates.status !== "completed") {
            task.completedAt = null;
        }
    }

    if (task.status === "completed" && !task.completedAt) {
        task.completedAt = new Date();
    }

    await task.save();

    return task;
};

export const deleteTask = async (userId, taskId) => {
    ensureTaskId(taskId);

    const task = await Task.findOneAndDelete({ _id: taskId, createdBy: userId });

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    return task;
};
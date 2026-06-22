import { validationResult } from "express-validator";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
    createTask as createTaskService,
    deleteTask as deleteTaskService,
    getTaskById as getTaskByIdService,
    getTasks as getTasksService,
    updateTask as updateTaskService,
} from "../services/taskservice.js";

const getValidationError = (req) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return errors.array()[0].msg;
    }

    return null;
};

export const createTask = asyncHandler(async (req, res, next) => {
    const validationError = getValidationError(req);
    if (validationError) {
        return next(new ApiError(400, validationError));
    }

    const task = await createTaskService(req.user._id, req.body);

    return res.status(201).json({
        success: true,
        message: "Task created successfully",
        task,
    });
});

export const getTasks = asyncHandler(async (req, res, next) => {
    const validationError = getValidationError(req);
    if (validationError) {
        return next(new ApiError(400, validationError));
    }

    const { tasks, pagination } = await getTasksService(req.user._id, req.query);

    return res.status(200).json({
        success: true,
        tasks,
        pagination,
    });
});

export const getTaskById = asyncHandler(async (req, res, next) => {
    const validationError = getValidationError(req);
    if (validationError) {
        return next(new ApiError(400, validationError));
    }

    const task = await getTaskByIdService(req.user._id, req.params.id);

    return res.status(200).json({
        success: true,
        task,
    });
});

export const updateTask = asyncHandler(async (req, res, next) => {
    const validationError = getValidationError(req);
    if (validationError) {
        return next(new ApiError(400, validationError));
    }

    const task = await updateTaskService(req.user._id, req.params.id, req.body);

    return res.status(200).json({
        success: true,
        message: "Task updated successfully",
        task,
    });
});

export const deleteTask = asyncHandler(async (req, res, next) => {
    const validationError = getValidationError(req);
    if (validationError) {
        return next(new ApiError(400, validationError));
    }

    await deleteTaskService(req.user._id, req.params.id);

    return res.status(200).json({
        success: true,
        message: "Task deleted successfully",
    });
});
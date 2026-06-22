import { body, param, query } from "express-validator";

const taskUpdateFields = ["title", "description", "status", "priority", "dueDate"];

export const createTaskValidation = [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("description").optional({ nullable: true, checkFalsy: true }).isString().withMessage("Description must be a string"),
    body("status")
        .optional()
        .isIn(["todo", "in-progress", "completed"])
        .withMessage("Status must be todo, in-progress, or completed"),
    body("priority")
        .optional()
        .isIn(["low", "medium", "high"])
        .withMessage("Priority must be low, medium, or high"),
    body("dueDate")
        .optional({ nullable: true, checkFalsy: true })
        .isISO8601()
        .withMessage("Due date must be a valid date")
        .toDate(),
];

export const updateTaskValidation = [
    param("id").isMongoId().withMessage("Invalid task id"),
    body().custom((_, { req }) => {
        const hasTaskField = taskUpdateFields.some((field) => req.body[field] !== undefined);

        if (!hasTaskField) {
            throw new Error("At least one task field is required");
        }

        return true;
    }),
    body("title").optional().trim().notEmpty().withMessage("Title cannot be empty"),
    body("description").optional({ nullable: true, checkFalsy: true }).isString().withMessage("Description must be a string"),
    body("status")
        .optional()
        .isIn(["todo", "in-progress", "completed"])
        .withMessage("Status must be todo, in-progress, or completed"),
    body("priority")
        .optional()
        .isIn(["low", "medium", "high"])
        .withMessage("Priority must be low, medium, or high"),
    body("dueDate")
        .optional({ nullable: true, checkFalsy: true })
        .isISO8601()
        .withMessage("Due date must be a valid date")
        .toDate(),
];

export const getTaskByIdValidation = [param("id").isMongoId().withMessage("Invalid task id")];

export const deleteTaskValidation = [param("id").isMongoId().withMessage("Invalid task id")];

export const listTasksValidation = [
    query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer").toInt(),
    query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100").toInt(),
    query("search").optional().trim().isLength({ max: 100 }).withMessage("Search term is too long"),
    query("status")
        .optional()
        .isIn(["todo", "in-progress", "completed"])
        .withMessage("Status must be todo, in-progress, or completed"),
    query("priority")
        .optional()
        .isIn(["low", "medium", "high"])
        .withMessage("Priority must be low, medium, or high"),
    query("sortBy").optional().isIn(["createdAt", "dueDate"]).withMessage("Sort field must be createdAt or dueDate"),
    query("sortOrder").optional().isIn(["asc", "desc"]).withMessage("Sort order must be asc or desc"),
];
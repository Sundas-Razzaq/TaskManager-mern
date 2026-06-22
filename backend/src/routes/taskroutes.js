import express from "express";
import authMiddleware from "../middleware/authmiddleware.js";
import {
    createTaskValidation,
    deleteTaskValidation,
    getTaskByIdValidation,
    listTasksValidation,
    updateTaskValidation,
} from "../validators/taskvalidators.js";
import {
    createTask,
    deleteTask,
    getTaskById,
    getTasks,
    updateTask,
} from "../controllers/taskcontroller.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createTaskValidation, createTask);
router.get("/", listTasksValidation, getTasks);
router.get("/:id", getTaskByIdValidation, getTaskById);
router.put("/:id", updateTaskValidation, updateTask);
router.delete("/:id", deleteTaskValidation, deleteTask);

export default router;
import express from "express";
import { body } from "express-validator";
import {
    forgotPassword,
    getCurrentUser,
    loginUser,
    logoutUser,
    registerUser,
    resetPassword,
} from "../controllers/authcontroller.js";
import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

router.post(
    "/register",
    [
        body("name").trim().notEmpty().withMessage("Name is required"),
        body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
        body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    ],
    registerUser
);

router.post(
    "/login",
    [
        body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
        body("password").notEmpty().withMessage("Password is required"),
    ],
    loginUser
);

router.post("/logout", logoutUser);
router.post("/forgot-password", [body("email").isEmail().withMessage("Valid email is required")], forgotPassword);
router.put(
    "/reset-password/:token",
    [body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters")],
    resetPassword
);
router.get("/me", authMiddleware, getCurrentUser);

export default router;
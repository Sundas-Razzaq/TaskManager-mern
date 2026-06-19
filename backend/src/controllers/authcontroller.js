import { validationResult } from "express-validator";
import crypto from "crypto";
import User from "../models/user.js";
import generateToken from "../utils/generateTokens.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import sendEmail, { passwordResetTemplate } from "../utils/sendEmail.js";

const sanitizeUser = (user) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
});

const buildAuthResponse = (res, user, statusCode = 200) => {
    const token = generateToken(user._id);

    return res.status(statusCode).json({
        success: true,
        token,
        user: sanitizeUser(user),
    });
};

export const registerUser = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ApiError(400, errors.array()[0].msg));
    }

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(new ApiError(409, "User already exists"));
    }

    const user = await User.create({
        name,
        email,
        password,
    });

    return buildAuthResponse(res, user, 201);
});

export const loginUser = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ApiError(400, errors.array()[0].msg));
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ApiError(401, "Invalid credentials"));
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        return next(new ApiError(401, "Invalid credentials"));
    }

    return buildAuthResponse(res, user);
});

export const logoutUser = asyncHandler(async (_req, res) => {
    return res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json({
        success: true,
        user: sanitizeUser(req.user),
    });
});

export const forgotPassword = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ApiError(400, errors.array()[0].msg));
    }

    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return next(new ApiError(404, "No user found with that email"));
    }

    const resetToken = user.generateResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const frontendBaseUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetUrl = `${frontendBaseUrl}/reset-password/${resetToken}`;

    await sendEmail({
        to: user.email,
        subject: "Password reset request",
        html: passwordResetTemplate({ name: user.name, resetUrl }),
        text: `Reset your password here: ${resetUrl}`,
    });

    return res.status(200).json({
        success: true,
        message: "Password reset email sent",
    });
});

export const resetPassword = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ApiError(400, errors.array()[0].msg));
    }

    const { token } = req.params;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        return next(new ApiError(400, "Reset token is invalid or has expired"));
    }

    user.password = req.body.password;
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    await user.save();

    return buildAuthResponse(res, user);
});
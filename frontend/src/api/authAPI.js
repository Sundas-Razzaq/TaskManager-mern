import api from "./axiosInstance";

export const registerUser = (payload) => api.post("/auth/register", payload);
export const loginUser = (payload) => api.post("/auth/login", payload);
export const logoutUser = () => api.post("/auth/logout");
export const forgotPassword = (payload) => api.post("/auth/forgot-password", payload);
export const resetPassword = (token, payload) => api.put(`/auth/reset-password/${token}`, payload);
export const getCurrentUser = () => api.get("/auth/me");
export const updateUser = (userData) => api.put("/auth/me", userData);
export const changePassword = (passwordData) => api.put("/auth/change-password", passwordData);

export default {
    registerUser,
    loginUser,
    logoutUser,
    forgotPassword,
    resetPassword,
    getCurrentUser,
    updateUser,
    changePassword,
};
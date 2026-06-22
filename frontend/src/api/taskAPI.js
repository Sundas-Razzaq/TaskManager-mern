import api from "./axiosInstance";

export const createTask = (payload) => api.post("/tasks", payload);
export const getTasks = (params = {}) => api.get("/tasks", { params });
export const getTaskById = (taskId) => api.get(`/tasks/${taskId}`);
export const updateTask = (taskId, payload) => api.put(`/tasks/${taskId}`, payload);
export const deleteTask = (taskId) => api.delete(`/tasks/${taskId}`);

export default {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
};

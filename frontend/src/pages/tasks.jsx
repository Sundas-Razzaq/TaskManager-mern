import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { createTask, deleteTask, getTasks, updateTask } from "../api/taskAPI.js";
import { resolveErrorMessage } from "../utils/helpers.jsx";

const taskStatusLabels = {
    todo: "To do",
    "in-progress": "In progress",
    completed: "Completed",
};

const taskStatusOrder = ["todo", "in-progress", "completed"];

const getNextStatus = (status) => {
    const currentIndex = taskStatusOrder.indexOf(status);
    return taskStatusOrder[(currentIndex + 1) % taskStatusOrder.length];
};

const formatTaskStatus = (status) => taskStatusLabels[status] || status;

const TasksPage = () => {
    const [tasks, setTasks] = useState([]);
    const [pagination, setPagination] = useState({ totalTasks: 0, totalPages: 1, page: 1, limit: 10 });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState({
        search: "",
        status: "",
        priority: "",
        sortBy: "createdAt",
        sortOrder: "desc",
    });
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        status: "todo",
        priority: "medium",
        dueDate: "",
    });

    const fetchTasks = async (pageNumber = 1) => {
        try {
            setLoading(true);
            const response = await getTasks({
                page: pageNumber,
                limit: 10,
                search: filters.search || undefined,
                status: filters.status || undefined,
                priority: filters.priority || undefined,
                sortBy: filters.sortBy,
                sortOrder: filters.sortOrder,
            });

            setTasks(response.data.tasks || []);
            setPagination(response.data.pagination || { totalTasks: 0, totalPages: 1, page: 1, limit: 10 });
            setPage(response.data.pagination?.page || pageNumber);
        } catch (error) {
            toast.error(resolveErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setPage(1);
        fetchTasks(1);
    }, [filters]);

    const completedCount = useMemo(() => tasks.filter((task) => task.status === "completed").length, [tasks]);

    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        setFilters((current) => ({ ...current, [name]: value }));
    };

    const handleFormChange = (event) => {
        const { name, value } = event.target;
        setFormData((current) => ({ ...current, [name]: value }));
    };

    const handleCreateTask = async (event) => {
        event.preventDefault();

        try {
            setSaving(true);
            await createTask({
                ...formData,
                dueDate: formData.dueDate || undefined,
            });

            toast.success("Task created successfully");
            setFormData({
                title: "",
                description: "",
                status: "todo",
                priority: "medium",
                dueDate: "",
            });
            await fetchTasks(page);
        } catch (error) {
            toast.error(resolveErrorMessage(error));
        } finally {
            setSaving(false);
        }
    };

    const handleToggleStatus = async (task) => {
        try {
            const nextStatus = getNextStatus(task.status);
            await updateTask(task._id, { status: nextStatus });
            toast.success("Task updated successfully");
            await fetchTasks(page);
        } catch (error) {
            toast.error(resolveErrorMessage(error));
        }
    };

    const handleDeleteTask = async (taskId) => {
        const confirmed = window.confirm("Delete this task?");
        if (!confirmed) {
            return;
        }

        try {
            await deleteTask(taskId);
            toast.success("Task deleted successfully");
            await fetchTasks(page);
        } catch (error) {
            toast.error(resolveErrorMessage(error));
        }
    };

    return (
        <main className="dashboard-page">
            <section className="dashboard-card dashboard-card--wide">
                <div className="dashboard-card__top">
                    <div>
                        <h1>Tasks workspace</h1>
                        <p className="dashboard-note">
                            Create, search, filter, and manage your own tasks through the live backend APIs.
                        </p>
                    </div>
                    <div className="dashboard-links dashboard-links--dark">
                        <Link to="/dashboard">Back to dashboard</Link>
                    </div>
                </div>

                <div className="task-toolbar">
                    <label>
                        Search
                        <input type="search" name="search" placeholder="Search by title" value={filters.search} onChange={handleFilterChange} />
                    </label>
                    <label>
                        Status
                        <select name="status" value={filters.status} onChange={handleFilterChange}>
                            <option value="">All</option>
                            <option value="todo">To do</option>
                            <option value="in-progress">In progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </label>
                    <label>
                        Priority
                        <select name="priority" value={filters.priority} onChange={handleFilterChange}>
                            <option value="">All</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </label>
                    <label>
                        Sort by
                        <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
                            <option value="createdAt">Created at</option>
                            <option value="dueDate">Due date</option>
                        </select>
                    </label>
                    <label>
                        Order
                        <select name="sortOrder" value={filters.sortOrder} onChange={handleFilterChange}>
                            <option value="desc">Newest first</option>
                            <option value="asc">Oldest first</option>
                        </select>
                    </label>
                </div>

                <div className="task-layout">
                    <section className="task-panel">
                        <div className="dashboard-section__header">
                            <div>
                                <p className="eyebrow">Create task</p>
                                <h2>New task entry</h2>
                            </div>
                        </div>

                        <form className="task-form" onSubmit={handleCreateTask}>
                            <label>
                                Title
                                <input type="text" name="title" value={formData.title} onChange={handleFormChange} placeholder="Ship dashboard widgets" required />
                            </label>

                            <label>
                                Description
                                <textarea name="description" value={formData.description} onChange={handleFormChange} placeholder="Optional notes for the task" rows="4" />
                            </label>

                            <div className="task-form__grid">
                                <label>
                                    Status
                                    <select name="status" value={formData.status} onChange={handleFormChange}>
                                        <option value="todo">To do</option>
                                        <option value="in-progress">In progress</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </label>

                                <label>
                                    Priority
                                    <select name="priority" value={formData.priority} onChange={handleFormChange}>
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </label>
                            </div>

                            <label>
                                Due date
                                <input type="datetime-local" name="dueDate" value={formData.dueDate} onChange={handleFormChange} />
                            </label>

                            <button type="submit" disabled={saving}>
                                {saving ? "Saving..." : "Create task"}
                            </button>
                        </form>
                    </section>

                    <section className="task-panel task-panel--list">
                        <div className="dashboard-section__header">
                            <div>
                                <p className="eyebrow">Task list</p>
                                <h2>
                                    {pagination.totalTasks} total {completedCount ? `- ${completedCount} completed on this page` : ""}
                                </h2>
                            </div>
                        </div>

                        {loading ? (
                            <p className="dashboard-note">Loading tasks...</p>
                        ) : tasks.length === 0 ? (
                            <p className="dashboard-note">No tasks found. Clear filters or create a new task to verify the backend response.</p>
                        ) : (
                            <div className="task-list">
                                {tasks.map((task) => (
                                    <article key={task._id} className="task-card">
                                        <div className="task-card__header">
                                            <div>
                                                <h3>{task.title}</h3>
                                                <p>{task.description || "No description provided."}</p>
                                            </div>
                                            <button type="button" className={`task-pill task-pill--${task.status} task-pill--button`} onClick={() => handleToggleStatus(task)}>
                                                {formatTaskStatus(task.status)}
                                                <span className="task-pill__hint">Click to update</span>
                                            </button>
                                        </div>

                                        <div className="task-meta">
                                            <span>Priority: {task.priority}</span>
                                            <span>Due: {task.dueDate ? new Date(task.dueDate).toLocaleString() : "Not set"}</span>
                                            <span>Created: {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : "Unknown"}</span>
                                        </div>

                                        <div className="task-card__actions">
                                            <button type="button" className="ghost-button" onClick={() => handleToggleStatus(task)}>
                                                Update status
                                            </button>
                                            <button type="button" className="ghost-button" onClick={() => handleDeleteTask(task._id)}>
                                                Delete
                                            </button>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}

                        <div className="task-pagination">
                            <button type="button" className="ghost-button" onClick={() => fetchTasks(Math.max(1, page - 1))} disabled={loading || page <= 1}>
                                Previous
                            </button>
                            <span>
                                Page {pagination.page} of {pagination.totalPages || 1}
                            </span>
                            <button type="button" className="ghost-button" onClick={() => fetchTasks(Math.min(pagination.totalPages, page + 1))} disabled={loading || page >= pagination.totalPages}>
                                Next
                            </button>
                        </div>
                    </section>
                </div>
            </section>
        </main>
    );
};

export default TasksPage;

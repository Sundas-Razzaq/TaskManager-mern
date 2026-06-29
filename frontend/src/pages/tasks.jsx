// pages/tasks.jsx
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
    const [currentPage, setCurrentPage] = useState(1);
    const [editingTask, setEditingTask] = useState(null); // Track which task is being edited
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
            setCurrentPage(response.data.pagination?.page || pageNumber);
        } catch (error) {
            toast.error(resolveErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    // Fetch tasks when filters change
    useEffect(() => {
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
            await fetchTasks(currentPage);
        } catch (error) {
            toast.error(resolveErrorMessage(error));
        } finally {
            setSaving(false);
        }
    };

    //editing a task 
    const handleStartEdit = (task) => {
        setEditingTask(task._id);
        setFormData({
            title: task.title || "",
            description: task.description || "",
            status: task.status || "todo",
            priority: task.priority || "medium",
            dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : "",
        });

        // Scroll to the form
        document.querySelector('.task-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    // Cancel editing
    const handleCancelEdit = () => {
        setEditingTask(null);
        setFormData({
            title: "",
            description: "",
            status: "todo",
            priority: "medium",
            dueDate: "",
        });
    };

    // Update existing task
    const handleUpdateTask = async (event) => {
        event.preventDefault();

        try {
            setSaving(true);
            await updateTask(editingTask, {
                ...formData,
                dueDate: formData.dueDate || undefined,
            });

            toast.success("Task updated successfully");
            setEditingTask(null);
            setFormData({
                title: "",
                description: "",
                status: "todo",
                priority: "medium",
                dueDate: "",
            });
            await fetchTasks(currentPage);
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
            await fetchTasks(currentPage);
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
            await fetchTasks(currentPage);
        } catch (error) {
            toast.error(resolveErrorMessage(error));
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            fetchTasks(newPage);
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
                                <p className="eyebrow">{editingTask ? "Edit task" : "Create task"}</p>
                                <h2>{editingTask ? "Update task entry" : "New task entry"}</h2>
                            </div>
                            {editingTask && (
                                <button
                                    type="button"
                                    className="ghost-button"
                                    onClick={handleCancelEdit}
                                >
                                    Cancel Editing
                                </button>
                            )}
                        </div>

                        <form className="task-form" onSubmit={editingTask ? handleUpdateTask : handleCreateTask}>
                            <label>
                                Title
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleFormChange}
                                    placeholder="Ship dashboard widgets"
                                    required
                                />
                            </label>

                            <label>
                                Description
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleFormChange}
                                    placeholder="Optional notes for the task"
                                    rows="4"
                                />
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
                                <input
                                    type="datetime-local"
                                    name="dueDate"
                                    value={formData.dueDate}
                                    onChange={handleFormChange}
                                />
                            </label>

                            <button type="submit" disabled={saving}>
                                {saving
                                    ? (editingTask ? "Updating..." : "Saving...")
                                    : (editingTask ? "Update Task" : "Create Task")
                                }
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
                            <span style={{ color: 'rgba(229, 238, 252, 0.5)', fontSize: '0.9rem' }}>
                                Showing {tasks.length} of {pagination.totalTasks} tasks
                            </span>
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
                                            <button
                                                type="button"
                                                className={`task-pill task-pill--${task.status} task-pill--button`}
                                                onClick={() => handleToggleStatus(task)}
                                            >
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
                                            <button
                                                type="button"
                                                className="ghost-button"
                                                onClick={() => handleStartEdit(task)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                className="ghost-button"
                                                onClick={() => handleToggleStatus(task)}
                                            >
                                                Update status
                                            </button>
                                            <button
                                                type="button"
                                                className="ghost-button"
                                                onClick={() => handleDeleteTask(task._id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}

                        {pagination.totalPages > 1 && (
                            <div className="task-pagination">
                                <button
                                    type="button"
                                    className="ghost-button"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={loading || currentPage <= 1}
                                >
                                    Previous
                                </button>

                                <div className="task-pagination__pages">
                                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                        let pageNum;
                                        if (pagination.totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (currentPage <= 3) {
                                            pageNum = i + 1;
                                        } else if (currentPage >= pagination.totalPages - 2) {
                                            pageNum = pagination.totalPages - 4 + i;
                                        } else {
                                            pageNum = currentPage - 2 + i;
                                        }

                                        return (
                                            <button
                                                key={pageNum}
                                                type="button"
                                                className={`task-pagination__page ${currentPage === pageNum ? 'task-pagination__page--active' : ''}`}
                                                onClick={() => handlePageChange(pageNum)}
                                                disabled={loading}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    type="button"
                                    className="ghost-button"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={loading || currentPage >= pagination.totalPages}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </section>
                </div>
            </section>
        </main>
    );
};

export default TasksPage;
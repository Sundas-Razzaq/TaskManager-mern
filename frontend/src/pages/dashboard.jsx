import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getCurrentUser, logoutUser } from "../api/authAPI.js";
import { getTasks, updateTask } from "../api/taskAPI.js";
import { clearAuthSession, getStoredUser, resolveErrorMessage } from "../utils/helpers.jsx";

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

// Icons
const DashboardIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
    </svg>
);

const TasksIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
    </svg>
);

const ProfileIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
);

const SettingsIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
    </svg>
);

const LogoutIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
    </svg>
);

const formatTaskStatus = (status) => taskStatusLabels[status] || status;

const DashboardPage = () => {
    const [user, setUser] = useState(getStoredUser());
    const [loading, setLoading] = useState(true);
    const [tasksLoading, setTasksLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [taskSummary, setTaskSummary] = useState({
        totalTasks: 0,
        todoCount: 0,
        inProgressCount: 0,
        completedCount: 0,
        recentTasks: [],
    });
    const navigate = useNavigate();

    useEffect(() => {
        const loadUser = async () => {
            try {
                const response = await getCurrentUser();
                setUser(response.data.user);
            } catch (error) {
                toast.error(resolveErrorMessage(error));
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    useEffect(() => {
        const loadTaskSummary = async () => {
            try {
                setTasksLoading(true);
                const response = await getTasks({ limit: 100, sortBy: "createdAt", sortOrder: "desc" });
                const tasks = response.data.tasks || [];

                setTaskSummary({
                    totalTasks: response.data.pagination?.totalTasks || 0,
                    todoCount: tasks.filter((task) => task.status === "todo").length,
                    inProgressCount: tasks.filter((task) => task.status === "in-progress").length,
                    completedCount: tasks.filter((task) => task.status === "completed").length,
                    recentTasks: tasks.slice(0, 4),
                });
            } catch (error) {
                toast.error(resolveErrorMessage(error));
            } finally {
                setTasksLoading(false);
            }
        };

        loadTaskSummary();
    }, []);

    const handleToggleTaskStatus = async (task) => {
        try {
            const nextStatus = getNextStatus(task.status);
            await updateTask(task._id, { status: nextStatus });
            toast.success(`Task moved to ${formatTaskStatus(nextStatus).toLowerCase()}`);

            const response = await getTasks({ limit: 100, sortBy: "createdAt", sortOrder: "desc" });
            const tasks = response.data.tasks || [];
            setTaskSummary({
                totalTasks: response.data.pagination?.totalTasks || 0,
                todoCount: tasks.filter((t) => t.status === "todo").length,
                inProgressCount: tasks.filter((t) => t.status === "in-progress").length,
                completedCount: tasks.filter((t) => t.status === "completed").length,
                recentTasks: tasks.slice(0, 4),
            });
        } catch (error) {
            toast.error(resolveErrorMessage(error));
        }
    };

    const handleLogout = async () => {
        try {
            await logoutUser();
        } catch {
            // Stateless JWT logout is handled by clearing local storage on the client.
        } finally {
            clearAuthSession();
            navigate("/login", { replace: true });
        }
    };

    return (
        <main className="dashboard-page">
            <div className={`dashboard-shell ${sidebarOpen ? "" : "dashboard-shell--collapsed"}`}>
                <aside className="dashboard-sidebar">
                    <div className="dashboard-sidebar__top">
                        <div className="dashboard-sidebar__brand">
                            <div className="dashboard-sidebar__avatar">
                                {user?.name?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                            {sidebarOpen && (
                                <div className="dashboard-sidebar__brand-text">
                                    <p className="eyebrow">Task Manager</p>
                                    <strong>{user?.name || "Your profile"}</strong>
                                </div>
                            )}
                        </div>
                        <button
                            type="button"
                            className="sidebar-toggle-button"
                            onClick={() => setSidebarOpen((current) => !current)}
                            aria-label="Toggle sidebar"
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '20px', height: '20px' }}>
                                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
                            </svg>
                        </button>
                    </div>

                    <nav className="dashboard-sidebar__nav">
                        <Link to="/dashboard" className="dashboard-sidebar__link dashboard-sidebar__link--active">
                            <span className="dashboard-sidebar__icon"><DashboardIcon /></span>
                            {sidebarOpen && <span>Dashboard</span>}
                        </Link>
                        <Link to="/tasks" className="dashboard-sidebar__link">
                            <span className="dashboard-sidebar__icon"><TasksIcon /></span>
                            {sidebarOpen && <span>Tasks</span>}
                        </Link>
                        <Link to="/profile" className="dashboard-sidebar__link">
                            <span className="dashboard-sidebar__icon"><ProfileIcon /></span>
                            {sidebarOpen && <span>Profile</span>}
                        </Link>
                        <Link to="/settings" className="dashboard-sidebar__link">
                            <span className="dashboard-sidebar__icon"><SettingsIcon /></span>
                            {sidebarOpen && <span>Settings</span>}
                        </Link>
                    </nav>

                    <div className="dashboard-sidebar__bottom">
                        <div className="dashboard-sidebar__user">
                            <div className="dashboard-sidebar__user-avatar">
                                {user?.name?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                            {sidebarOpen && (
                                <div className="dashboard-sidebar__user-info">
                                    <strong>{user?.name || "User"}</strong>
                                    <span>{user?.email || "user@example.com"}</span>
                                </div>
                            )}
                        </div>
                        <button type="button" className="sidebar-logout-button" onClick={handleLogout}>
                            <LogoutIcon />
                            {sidebarOpen && <span>Logout</span>}
                        </button>
                    </div>
                </aside>

                <div className="dashboard-main">
                    <div className="dashboard-main__top">
                        <div>
                            <p className="eyebrow">Protected route</p>
                            <h1>Dashboard</h1>
                        </div>
                        <div className="dashboard-links dashboard-links--dark">
                            <Link to="/tasks">Go to tasks</Link>
                            <Link to="/profile" className="profile-button">
                                <ProfileIcon />
                                <span>Profile</span>
                            </Link>
                        </div>
                    </div>

                    {loading ? (
                        <p className="dashboard-note">Loading your account...</p>
                    ) : (
                        <>
                            <div className="dashboard-section">
                                <div className="dashboard-section__header">
                                    <div>
                                        <p className="eyebrow">Task snapshot</p>
                                        <h2>Task Activity</h2>
                                    </div>
                                    <Link to="/tasks">Open task workspace →</Link>
                                </div>

                                {tasksLoading ? (
                                    <p className="dashboard-note">Loading task summary...</p>
                                ) : (
                                    <>
                                        <div className="dashboard-stats">
                                            <article>
                                                <span>Total tasks</span>
                                                <strong>{taskSummary.totalTasks}</strong>
                                            </article>
                                            <article>
                                                <span>To do</span>
                                                <strong>{taskSummary.todoCount}</strong>
                                            </article>
                                            <article>
                                                <span>In progress</span>
                                                <strong>{taskSummary.inProgressCount}</strong>
                                            </article>
                                            <article>
                                                <span>Completed</span>
                                                <strong>{taskSummary.completedCount}</strong>
                                            </article>
                                        </div>

                                        <div className="dashboard-task-list">
                                            {taskSummary.recentTasks.length === 0 ? (
                                                <p className="dashboard-note">No tasks found yet. Create one from the task workspace to verify the API flow end to end.</p>
                                            ) : (
                                                taskSummary.recentTasks.map((task) => {
                                                    const nextStatus = getNextStatus(task.status);

                                                    return (
                                                        <article key={task._id} className="dashboard-task-item">
                                                            <div className="dashboard-task-item__copy">
                                                                <strong>{task.title}</strong>
                                                                <p>{task.description || "No description provided."}</p>
                                                            </div>
                                                            <button type="button" className={`task-pill task-pill--${task.status} task-pill--button`} onClick={() => handleToggleTaskStatus(task)}>
                                                                {formatTaskStatus(task.status)}
                                                                <span className="task-pill__hint">Click for {formatTaskStatus(nextStatus).toLowerCase()}</span>
                                                            </button>
                                                        </article>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </main>
    );
};

export default DashboardPage;
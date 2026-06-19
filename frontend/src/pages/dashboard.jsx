import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getCurrentUser, logoutUser } from "../api/authAPI.js";
import { clearAuthSession, getStoredUser, resolveErrorMessage } from "../utils/helpers.jsx";

const DashboardPage = () => {
    const [user, setUser] = useState(getStoredUser());
    const [loading, setLoading] = useState(true);
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

    const handleLogout = async () => {
        try {
            await logoutUser();
        } catch (_error) {
            // Stateless JWT logout is handled by clearing local storage on the client.
        } finally {
            clearAuthSession();
            navigate("/login", { replace: true });
        }
    };

    return (
        <main className="dashboard-page">
            <section className="dashboard-card">
                <div className="dashboard-card__top">
                    <div>
                        <p className="eyebrow">Protected route</p>
                        <h1>Dashboard</h1>
                    </div>
                    <button type="button" className="ghost-button" onClick={handleLogout}>
                        Logout
                    </button>
                </div>

                {loading ? (
                    <p className="dashboard-note">Loading your account...</p>
                ) : (
                    <>
                        <div className="dashboard-grid">
                            <article>
                                <span>Name</span>
                                <strong>{user?.name || "Unknown"}</strong>
                            </article>
                            <article>
                                <span>Email</span>
                                <strong>{user?.email || "Unknown"}</strong>
                            </article>
                            <article>
                                <span>Role</span>
                                <strong>{user?.role || "user"}</strong>
                            </article>
                            <article>
                                <span>Verified</span>
                                <strong>{user?.isVerified ? "Yes" : "No"}</strong>
                            </article>
                        </div>

                        <p className="dashboard-note">
                            This screen confirms the backend JWT session and user lookup are working.
                        </p>

                        <div className="dashboard-links">
                            <Link to="/tasks">Go to tasks</Link>
                            <Link to="/forgot-password">Reset password</Link>
                        </div>
                    </>
                )}
            </section>
        </main>
    );
};

export default DashboardPage;

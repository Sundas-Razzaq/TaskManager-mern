// pages/ProfilePage.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getCurrentUser, updateUser, logoutUser, changePassword } from "../api/authAPI.js";
import { clearAuthSession, getStoredUser, resolveErrorMessage, setAuthSession, getStoredToken } from "../utils/helpers.jsx";

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

const EditIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '20px', height: '20px' }}>
        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
    </svg>
);

const SaveIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '20px', height: '20px' }}>
        <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z" />
    </svg>
);

const CancelIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '20px', height: '20px' }}>
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    </svg>
);

const ProfilePage = () => {
    const [user, setUser] = useState(getStoredUser());
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    // Form states
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        bio: "",
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const navigate = useNavigate();

    useEffect(() => {
        const loadUser = async () => {
            try {
                const response = await getCurrentUser();
                const userData = response.data.user;
                setUser(userData);
                setFormData({
                    name: userData.name || "",
                    email: userData.email || "",
                    bio: userData.bio || "",
                });
            } catch (error) {
                toast.error(resolveErrorMessage(error));
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const response = await updateUser(formData);
            const userData = response.data.user;

            // Update state
            setUser(userData);

            // Update stored user data
            const storedUser = getStoredUser();
            if (storedUser) {
                setAuthSession({
                    token: getStoredToken(),
                    user: { ...storedUser, ...userData }
                });
            }

            toast.success("Profile updated successfully!");
            setIsEditing(false);
        } catch (error) {
            toast.error(resolveErrorMessage(error));
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return;
        }

        setSaving(true);

        try {
            await changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });
            toast.success("Password changed successfully!");
            setShowPasswordForm(false);
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (error) {
            toast.error(resolveErrorMessage(error));
        } finally {
            setSaving(false);
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

    const getInitials = (name) => {
        if (!name) return "U";
        return name.charAt(0).toUpperCase();
    };

    const getMemberSince = () => {
        if (!user?.createdAt) return "N/A";
        const date = new Date(user.createdAt);
        return date.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <main className="dashboard-page">
                <div className="dashboard-shell">
                    <aside className="dashboard-sidebar">
                        <div className="dashboard-sidebar__top">
                            <div className="dashboard-sidebar__brand">
                                <div className="dashboard-sidebar__avatar">U</div>
                                <div className="dashboard-sidebar__brand-text">
                                    <p className="eyebrow">Task Manager</p>
                                    <strong>Loading...</strong>
                                </div>
                            </div>
                        </div>
                    </aside>
                    <div className="dashboard-main">
                        <p className="dashboard-note">Loading profile...</p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="dashboard-page">
            <div className={`dashboard-shell ${sidebarOpen ? "" : "dashboard-shell--collapsed"}`}>
                <aside className="dashboard-sidebar">
                    <div className="dashboard-sidebar__top">
                        <div className="dashboard-sidebar__brand">
                            <div className="dashboard-sidebar__avatar">
                                {getInitials(user?.name)}
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
                        <Link to="/dashboard" className="dashboard-sidebar__link">
                            <span className="dashboard-sidebar__icon"><DashboardIcon /></span>
                            {sidebarOpen && <span>Dashboard</span>}
                        </Link>
                        <Link to="/tasks" className="dashboard-sidebar__link">
                            <span className="dashboard-sidebar__icon"><TasksIcon /></span>
                            {sidebarOpen && <span>Tasks</span>}
                        </Link>
                        <Link to="/profile" className="dashboard-sidebar__link dashboard-sidebar__link--active">
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
                                {getInitials(user?.name)}
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
                            <p className="eyebrow">Task Manager</p>
                            <h1>Profile</h1>
                        </div>
                        <div className="dashboard-links dashboard-links--dark">
                            <Link to="/dashboard">Back to Dashboard</Link>
                            {!isEditing && (
                                <button
                                    className="ghost-button--dark"
                                    onClick={() => setIsEditing(true)}
                                >
                                    <EditIcon />
                                    <span>Edit Profile</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Profile Header */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '24px',
                        padding: '24px',
                        borderRadius: '18px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(148, 163, 184, 0.12)',
                        marginBottom: '28px'
                    }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            display: 'grid',
                            placeItems: 'center',
                            background: 'linear-gradient(135deg, #38bdf8 0%, #22c55e 100%)',
                            color: '#04111d',
                            fontWeight: '800',
                            fontSize: '2rem',
                            flexShrink: 0,
                        }}>
                            {getInitials(user?.name)}
                        </div>
                        <div style={{ flex: 1 }}>
                            <h2 style={{ margin: '0 0 4px 0', color: '#e5eefc' }}>
                                {user?.name || "User"}
                            </h2>
                            <p style={{ margin: '0 0 8px 0', color: 'rgba(229, 238, 252, 0.7)' }}>
                                {user?.email || "user@example.com"}
                            </p>
                            <div style={{
                                display: 'flex',
                                gap: '16px',
                                fontSize: '0.85rem',
                                color: 'rgba(229, 238, 252, 0.6)'
                            }}>
                                <span>Member since {getMemberSince()}</span>
                                {user?.bio && <span>• {user.bio}</span>}
                            </div>
                        </div>
                    </div>

                    {/* Profile Content */}
                    <div className="dashboard-section">
                        <div className="dashboard-section__header">
                            <h2>Personal Information</h2>
                            {isEditing && (
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button
                                        className="ghost-button"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setFormData({
                                                name: user?.name || "",
                                                email: user?.email || "",
                                                bio: user?.bio || "",
                                            });
                                        }}
                                    >
                                        <CancelIcon />
                                        <span>Cancel</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {isEditing ? (
                            <form onSubmit={handleUpdateProfile} className="auth-form" style={{ maxWidth: '600px' }}>
                                <label>
                                    Full Name
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Enter your full name"
                                        required
                                    />
                                </label>

                                <label>
                                    Email Address
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="Enter your email address"
                                        required
                                        disabled
                                        style={{ opacity: 0.6, cursor: 'not-allowed' }}
                                    />
                                    <span style={{
                                        fontSize: '0.75rem',
                                        color: 'rgba(229, 238, 252, 0.5)',
                                        marginTop: '4px'
                                    }}>
                                        Email cannot be changed
                                    </span>
                                </label>

                                <label>
                                    Bio
                                    <textarea
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleInputChange}
                                        placeholder="Tell us a little about yourself"
                                        rows="3"
                                        style={{
                                            border: '1px solid rgba(148, 163, 184, 0.24)',
                                            borderRadius: '14px',
                                            padding: '14px 16px',
                                            background: 'rgba(255, 255, 255, 0.03)',
                                            color: '#f8fafc',
                                            outline: 'none',
                                            resize: 'vertical',
                                            minHeight: '80px',
                                            fontFamily: 'inherit',
                                            fontSize: '0.95rem'
                                        }}
                                    />
                                </label>

                                <button type="submit" disabled={saving} style={{ marginTop: '8px' }}>
                                    {saving ? 'Saving...' : 'Save Changes'}
                                    {!saving && <SaveIcon style={{ marginLeft: '8px' }} />}
                                </button>
                            </form>
                        ) : (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                                gap: '16px',
                                maxWidth: '600px'
                            }}>
                                <div style={{
                                    padding: '16px',
                                    borderRadius: '14px',
                                    background: 'rgba(255, 255, 255, 0.04)',
                                    border: '1px solid rgba(148, 163, 184, 0.12)'
                                }}>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.08em',
                                        color: 'rgba(148, 163, 184, 0.7)',
                                        display: 'block',
                                        marginBottom: '4px'
                                    }}>
                                        Full Name
                                    </span>
                                    <strong style={{ color: '#e5eefc' }}>
                                        {user?.name || "Not set"}
                                    </strong>
                                </div>

                                <div style={{
                                    padding: '16px',
                                    borderRadius: '14px',
                                    background: 'rgba(255, 255, 255, 0.04)',
                                    border: '1px solid rgba(148, 163, 184, 0.12)'
                                }}>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.08em',
                                        color: 'rgba(148, 163, 184, 0.7)',
                                        display: 'block',
                                        marginBottom: '4px'
                                    }}>
                                        Email
                                    </span>
                                    <strong style={{ color: '#e5eefc' }}>
                                        {user?.email || "Not set"}
                                    </strong>
                                </div>

                                <div style={{
                                    padding: '16px',
                                    borderRadius: '14px',
                                    background: 'rgba(255, 255, 255, 0.04)',
                                    border: '1px solid rgba(148, 163, 184, 0.12)'
                                }}>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.08em',
                                        color: 'rgba(148, 163, 184, 0.7)',
                                        display: 'block',
                                        marginBottom: '4px'
                                    }}>
                                        Member Since
                                    </span>
                                    <strong style={{ color: '#e5eefc' }}>
                                        {getMemberSince()}
                                    </strong>
                                </div>

                                {user?.bio && (
                                    <div style={{
                                        padding: '16px',
                                        borderRadius: '14px',
                                        background: 'rgba(255, 255, 255, 0.04)',
                                        border: '1px solid rgba(148, 163, 184, 0.12)',
                                        gridColumn: '1 / -1'
                                    }}>
                                        <span style={{
                                            fontSize: '0.75rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.08em',
                                            color: 'rgba(148, 163, 184, 0.7)',
                                            display: 'block',
                                            marginBottom: '4px'
                                        }}>
                                            Bio
                                        </span>
                                        <p style={{ margin: 0, color: '#e5eefc' }}>
                                            {user.bio}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Change Password Section */}
                    <div className="dashboard-section">
                        <div className="dashboard-section__header">
                            <h2>Security</h2>
                            {!showPasswordForm && (
                                <button
                                    className="ghost-button"
                                    onClick={() => setShowPasswordForm(true)}
                                >
                                    Change Password
                                </button>
                            )}
                        </div>

                        {showPasswordForm ? (
                            <form onSubmit={handleChangePassword} className="auth-form" style={{ maxWidth: '600px' }}>
                                <label>
                                    Current Password
                                    <input
                                        type="password"
                                        name="currentPassword"
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordChange}
                                        placeholder="Enter current password"
                                        required
                                    />
                                </label>

                                <label>
                                    New Password
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        placeholder="Enter new password"
                                        required
                                        minLength="6"
                                    />
                                </label>

                                <label>
                                    Confirm New Password
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                        placeholder="Confirm new password"
                                        required
                                    />
                                </label>

                                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                                    <button type="submit" disabled={saving}>
                                        {saving ? 'Updating...' : 'Update Password'}
                                    </button>
                                    <button
                                        type="button"
                                        className="ghost-button"
                                        onClick={() => {
                                            setShowPasswordForm(false);
                                            setPasswordData({
                                                currentPassword: "",
                                                newPassword: "",
                                                confirmPassword: "",
                                            });
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div style={{
                                padding: '16px',
                                borderRadius: '14px',
                                background: 'rgba(255, 255, 255, 0.04)',
                                border: '1px solid rgba(148, 163, 184, 0.12)',
                                maxWidth: '600px',
                                color: 'rgba(229, 238, 252, 0.7)'
                            }}>
                                <p style={{ margin: 0 }}>
                                    Your password is securely stored. Click "Change Password" to update it.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Account Actions */}
                    <div className="dashboard-section" style={{ borderBottom: 'none' }}>
                        <div className="dashboard-section__header">
                            <h2>Account Actions</h2>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            <button
                                className="sidebar-logout-button"
                                onClick={handleLogout}
                                style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171' }}
                            >
                                <LogoutIcon />
                                <span>Logout</span>
                            </button>
                            <Link
                                to="/tasks"
                                className="ghost-button"
                                style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                            >
                                <TasksIcon />
                                <span>Go to Tasks</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ProfilePage;
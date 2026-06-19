import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import AuthPageShell from "../components/auth/AuthPageShell.jsx";
import { resetPassword } from "../api/authAPI.js";
import { resolveErrorMessage, setAuthSession } from "../utils/helpers.jsx";

const PasswordResetPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ password: "", confirmPassword: "" });
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((current) => ({ ...current, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const response = await resetPassword(token, { password: formData.password });
            setAuthSession(response.data);
            toast.success("Password updated successfully");
            navigate("/dashboard", { replace: true });
        } catch (error) {
            toast.error(resolveErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthPageShell
            eyebrow="Set a new password"
            title="Reset your password"
            subtitle="Choose a new password and continue back into your workspace."
            footer={
                <p>
                    Need a new link? <Link to="/forgot-password">Request another reset</Link>
                </p>
            }
        >
            <form className="auth-form" onSubmit={handleSubmit}>
                <label>
                    New password
                    <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Create a new password" required />
                </label>

                <label>
                    Confirm new password
                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm password" required />
                </label>

                <button type="submit" disabled={loading}>
                    {loading ? "Updating..." : "Reset password"}
                </button>
            </form>
        </AuthPageShell>
    );
};

export default PasswordResetPage;

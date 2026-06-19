import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthPageShell from "../components/auth/AuthPageShell.jsx";
import { loginUser } from "../api/authAPI.js";
import { isAuthenticated, resolveErrorMessage, setAuthSession } from "../utils/helpers.jsx";

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (isAuthenticated()) {
            navigate("/dashboard", { replace: true });
        }
    }, [navigate]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((current) => ({ ...current, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const response = await loginUser(formData);
            setAuthSession(response.data);
            toast.success("Logged in successfully");
            const redirectTo = location.state?.from?.pathname || "/dashboard";
            navigate(redirectTo, { replace: true });
        } catch (error) {
            toast.error(resolveErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthPageShell
            eyebrow="Welcome back"
            title="Sign in to continue"
            subtitle="Use your email and password to access your workspace."
            footer={
                <p>
                    New here? <Link to="/register">Create an account</Link>
                </p>
            }
        >
            <form className="auth-form" onSubmit={handleSubmit}>
                <label>
                    Email
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required />
                </label>

                <label>
                    Password
                    <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required />
                </label>

                <button type="submit" disabled={loading}>
                    {loading ? "Signing in..." : "Sign in"}
                </button>

                <div className="auth-form__links">
                    <Link to="/forgot-password">Forgot password?</Link>
                    <Link to="/register">Create account</Link>
                </div>
            </form>
        </AuthPageShell>
    );
};

export default LoginPage;

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthPageShell from "../components/auth/AuthPageShell.jsx";
import { registerUser } from "../api/authAPI.js";
import { isAuthenticated, resolveErrorMessage, setAuthSession } from "../utils/helpers.jsx";

const RegisterPage = () => {
    const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const response = await registerUser({
                name: formData.name,
                email: formData.email,
                password: formData.password,
            });

            setAuthSession(response.data);
            toast.success("Account created successfully");
            navigate("/dashboard", { replace: true });
        } catch (error) {
            toast.error(resolveErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthPageShell
            eyebrow="Start here"
            title="Create your account"
            subtitle="Register once and reuse the same auth stack across future projects."
            footer={
                <p>
                    Already have an account? <Link to="/login">Sign in</Link>
                </p>
            }
        >
            <form className="auth-form" onSubmit={handleSubmit}>
                <label>
                    Name
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Alex Morgan" required />
                </label>

                <label>
                    Email
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required />
                </label>

                <label>
                    Password
                    <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Create a strong password" required />
                </label>

                <label>
                    Confirm password
                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Re-enter password" required />
                </label>

                <button type="submit" disabled={loading}>
                    {loading ? "Creating account..." : "Create account"}
                </button>

                <div className="auth-form__links">
                    <Link to="/login">Already registered?</Link>
                    <Link to="/forgot-password">Need help signing in?</Link>
                </div>
            </form>
        </AuthPageShell>
    );
};

export default RegisterPage;

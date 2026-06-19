import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import AuthPageShell from "../components/auth/AuthPageShell.jsx";
import { forgotPassword } from "../api/authAPI.js";
import { resolveErrorMessage } from "../utils/helpers.jsx";

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            await forgotPassword({ email });
            setSent(true);
            toast.success("Reset instructions sent if the email exists");
        } catch (error) {
            toast.error(resolveErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthPageShell
            eyebrow="Password recovery"
            title="Request a reset link"
            subtitle="We will send a secure reset link to your inbox."
            footer={
                <p>
                    Remembered your password? <Link to="/login">Back to sign in</Link>
                </p>
            }
        >
            <form className="auth-form" onSubmit={handleSubmit}>
                <label>
                    Email
                    <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required />
                </label>

                <button type="submit" disabled={loading}>
                    {loading ? "Sending..." : "Send reset link"}
                </button>

                {sent ? <p className="auth-note">Check your email for the reset link.</p> : null}
            </form>
        </AuthPageShell>
    );
};

export default ForgotPasswordPage;

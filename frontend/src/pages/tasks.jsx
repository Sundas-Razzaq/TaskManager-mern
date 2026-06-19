import { Link } from "react-router-dom";

const TasksPage = () => {
    return (
        <main className="dashboard-page">
            <section className="dashboard-card">
                <p className="eyebrow">Protected route</p>
                <h1>Tasks workspace</h1>
                <p className="dashboard-note">
                    This page is protected by the shared JWT route guard and is ready for task CRUD integration.
                </p>
                <div className="dashboard-links">
                    <Link to="/dashboard">Back to dashboard</Link>
                    <Link to="/login">Sign in screen</Link>
                </div>
            </section>
        </main>
    );
};

export default TasksPage;

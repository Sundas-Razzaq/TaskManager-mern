// pages/LandingPage.jsx
import { Link } from "react-router-dom";
import robotImage from "../assets/robot.png";

const LandingPage = () => {
    return (
        <div className="landing-page">
            {/* Hero Section */}
            <section className="landing-hero">
                <div className="landing-hero__glow landing-hero__glow--one"></div>
                <div className="landing-hero__glow landing-hero__glow--two"></div>

                <div className="landing-container">
                    <div className="landing-hero__wrapper">
                        <div className="landing-hero__content">
                            <div className="landing-badge">
                                Task Manager
                            </div>

                            <h1 className="landing-hero__title">
                                Organize Your Tasks<br />
                                <span className="landing-gradient-text">Effortlessly</span>
                            </h1>

                            <p className="landing-hero__description">
                                A powerful, intuitive task management system designed to help you
                                stay organized, track progress, and achieve your goals faster.
                            </p>

                            <div className="landing-hero__buttons">
                                <Link to="/register" className="landing-btn landing-btn--primary">
                                    Get Started Free
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="landing-btn__icon">
                                        <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                                    </svg>
                                </Link>
                                <Link to="/login" className="landing-btn landing-btn--secondary">
                                    Sign In
                                </Link>
                            </div>
                        </div>

                        <div className="landing-hero__image">
                            <img
                                src={robotImage}
                                alt="Task Manager Robot"
                                className="landing-hero__robot"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
const AuthPageShell = ({ eyebrow, title, subtitle, children, footer }) => {
    return (
        <main className="auth-page">
            <section className="auth-hero" aria-hidden="true">
                <div className="auth-hero__glow auth-hero__glow--one" />
                <div className="auth-hero__glow auth-hero__glow--two" />
                <div className="auth-hero__content">
                    <p className="eyebrow">{eyebrow}</p>
                    <h1>Task Manager---Clear Your Mind</h1>
                    <p>
                        Stop trying to remember everything. Dump your to-do list into a reliable
                        system designed to keep your projects organized and moving forward.
                    </p>
                    <ul>
                        <li>Instant task sorting</li>
                        <li>Visual progress updates</li>
                        <li>Accessible on any device</li>
                    </ul>
                </div>
            </section>

            <section className="auth-card">
                <div className="auth-card__header">
                    <p className="eyebrow">{eyebrow}</p>
                    <h2>{title}</h2>
                    <p>{subtitle}</p>
                </div>

                {children}

                {footer ? <div className="auth-card__footer">{footer}</div> : null}
            </section>
        </main>
    );
};

export default AuthPageShell;

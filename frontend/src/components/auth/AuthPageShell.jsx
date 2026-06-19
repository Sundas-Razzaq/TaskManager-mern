const AuthPageShell = ({ eyebrow, title, subtitle, children, footer }) => {
    return (
        <main className="auth-page">
            <section className="auth-hero" aria-hidden="true">
                <div className="auth-hero__glow auth-hero__glow--one" />
                <div className="auth-hero__glow auth-hero__glow--two" />
                <div className="auth-hero__content">
                    <p className="eyebrow">{eyebrow}</p>
                    <h1>Task Manager Auth</h1>
                    <p>
                        A reusable authentication flow with JWT login, password reset, protected routes,
                        and a backend shape ready for future verification and admin roles.
                    </p>
                    <ul>
                        <li>JWT session handling</li>
                        <li>Reset token workflow</li>
                        <li>Frontend route protection</li>
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

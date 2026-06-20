# TaskManager-mern

Production-style MERN task manager with a reusable authentication module.

## What Was Built

The project now includes a modular auth system that can be reused in other MERN apps. It covers:

- User registration
- User login
- Stateless logout
- Forgot password flow
- Reset password flow with secure token verification
- JWT-based protected routes
- Frontend route protection with React Router
- Centralized Axios API handling
- Password reset email support through Nodemailer

## Auth Workflow

### 1. Register

1. The user submits `name`, `email`, and `password` from the register screen.
2. Frontend sends the payload to `POST /api/auth/register`.
3. Backend validates the input with `express-validator`.
4. Backend checks whether the email already exists.
5. The `User` model hashes the password before saving.
6. Backend creates a JWT token and returns it with safe user data.
7. Frontend stores the token and user profile in `localStorage`.

### 2. Login

1. The user enters email and password.
2. Frontend sends the payload to `POST /api/auth/login`.
3. Backend finds the user and compares the password using `bcryptjs`.
4. If valid, backend returns a fresh JWT and user data.
5. Frontend stores the session and redirects to the dashboard.

### 3. Logout

1. The user clicks logout.
2. Frontend clears the stored token and user session.
3. Because this project uses stateless JWTs, logout is handled on the client.
4. The optional backend logout route is kept for future blacklist or cookie-based strategies.

### 4. Protected Routes

1. Frontend checks whether a token exists before rendering protected pages.
2. If no token exists, the user is redirected to `/login`.
3. Backend protected routes use JWT verification middleware.
4. If the token is valid, the user is attached to `req.user`.
5. Protected pages such as dashboard and tasks are rendered only for authenticated users.

### 5. Forgot Password

1. The user submits their email.
2. Backend creates a cryptographically secure reset token with `crypto`.
3. The token is hashed before being stored in MongoDB.
4. An expiry time is added to the token record.
5. Backend sends an email with a reset link to the frontend reset page.

### 6. Reset Password

1. The user opens the reset link from email.
2. Frontend sends the token from the URL and the new password to the backend.
3. Backend hashes the URL token and compares it with the stored value.
4. Backend checks the expiry window.
5. Backend hashes the new password, updates the user, and clears reset fields.
6. Backend returns a fresh JWT session so the user can continue immediately.

## Backend Flow

The backend follows a clean MVC-style structure:

- `models/` handles MongoDB schemas and model methods.
- `controllers/` handles request logic.
- `routes/` maps HTTP endpoints to controller functions.
- `middleware/` handles auth verification and errors.
- `utils/` contains reusable helpers like token generation and email sending.

Main backend auth files:

- `backend/src/models/user.js`
- `backend/src/controllers/authcontroller.js`
- `backend/src/routes/authroutes.js`
- `backend/src/middleware/authmiddleware.js`
- `backend/src/utils/generateTokens.js`
- `backend/src/utils/sendEmail.js`

## Frontend Flow

The frontend is a Vite + React app with a simple reusable auth client:

- `src/api/axiosInstance.js` injects the JWT automatically.
- `src/api/authAPI.js` wraps all auth requests.
- `src/routes/protectedRoute.jsx` blocks unauthenticated access.
- `src/pages/` contains login, register, forgot password, reset password, dashboard, and tasks pages.
- `src/utils/helpers.jsx` stores and clears the auth session.

## Environment Variables

Backend needs:

- `MONGO_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN` optional
- `FRONTEND_URL`
- `EMAIL_USER`
- `EMAIL_PASS`
- `EMAIL_HOST` optional
- `EMAIL_PORT` optional
- `EMAIL_FROM` optional

## Run The App

Backend:

```bash
cd backend
npm install
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

## Why This Structure Works

This setup is reusable because the auth logic is separated from the UI and from the database model. That makes it easy to plug the same module into future MERN projects without rewriting the full authentication stack.

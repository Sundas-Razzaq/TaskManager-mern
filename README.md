# TaskManager-mern

Minimal MERN task manager with authentication, profile settings, and task CRUD.

## Features

- User registration and login with JWT auth
- Forgot password and reset password flow
- Protected routes on both backend and frontend
- Profile view and update, including password change
- Task CRUD for authenticated users
- Task search, filter, sort, and pagination
- Dashboard summary with recent tasks and status counts

## Tech Stack

- Backend: Node.js, Express, MongoDB, Mongoose
- Frontend: React, Vite, React Router, Axios
- Email reset flow: Nodemailer

## Setup

```bash
cd backend
npm install
npm run dev

cd ../frontend
npm install
npm run dev
```

## Environment Variables

Backend:

- `MONGO_URI`
- `JWT_SECRET`
- `FRONTEND_URL`
- `EMAIL_USER`
- `EMAIL_PASS`
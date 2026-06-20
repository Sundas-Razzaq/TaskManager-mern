# Frontend Auth App

This frontend is the React + Vite client for the reusable MERN authentication system.

## Frontend Workflow

1. The user opens the login or register screen.
2. The form submits to the backend through the centralized Axios instance.
3. On success, the JWT token and user object are stored in `localStorage`.
4. Protected pages use a route guard to verify the token exists.
5. The dashboard fetches the current user from the backend using the stored token.
6. Logout clears the session from the browser.

## Main Client Pieces

- `src/api/axiosInstance.js` adds the Bearer token automatically.
- `src/api/authAPI.js` contains the auth request functions.
- `src/routes/protectedRoute.jsx` guards authenticated pages.
- `src/pages/login.jsx` handles login.
- `src/pages/register.jsx` handles sign up.
- `src/pages/forgotpass.jsx` starts password recovery.
- `src/pages/passreset.jsx` completes password recovery.
- `src/pages/dashboard.jsx` shows the authenticated user.

## Start The Client

```bash
npm install
npm run dev
```

import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/login.jsx";
import RegisterPage from "./pages/register.jsx";
import ForgotPasswordPage from "./pages/forgotpass.jsx";
import PasswordResetPage from "./pages/passreset.jsx";
import DashboardPage from "./pages/dashboard.jsx";
import TasksPage from "./pages/tasks.jsx";
import ProfilePage from "./pages/profilePage.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import ProtectedRoute from "./routes/protectedRoute.jsx";
import { getStoredToken } from "./utils/helpers.jsx";

const defaultRoute = getStoredToken() ? "/dashboard" : "/login";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<PasswordResetPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<Navigate to={defaultRoute} replace />} />
    </Routes>
  );
}

export default App;
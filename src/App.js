import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation
} from "react-router-dom";

import Header from "./Header";
import Login from "./Login";
import Dashboard from "./Dashboard";
import { useState } from "react";
import AddJob from "./AddJob";
import JobDetails from "./JobDetails";
import AppliedJobs from "./AppliedJobs";
import EditJob from "./EditJobs";
import Register from "./Register";
import AdminDashboard from "./AdminDashboard";
import Profile from "./Profile";
import AdminApplications from "./AdminApplications";
 

/* ================= WRAPPER ================= */
function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

/* ================= MAIN APP ================= */
function App() {
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const role = localStorage.getItem("role");

  const hideHeaderRoutes = ["/", "/register"];

  return (
    <>
      {/* HEADER */}
      {!hideHeaderRoutes.includes(location.pathname) && (
        <Header setIsLoggedIn={setIsLoggedIn} />
      )}

      <Routes>

        {/* LOGIN */}
        <Route
          path="/"
          element={
            isLoggedIn ? (
              role === "admin" ? (
                <Navigate to="/admin" replace />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            ) : (
              <Login setIsLoggedIn={setIsLoggedIn} />
            )
          }
        />

        {/* REGISTER */}
        <Route path="/register" element={<Register />} />

        {/* USER DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            isLoggedIn && role !== "admin"
              ? <Dashboard />
              : <Navigate to="/" replace />
          }
        />
        

        {/* ADMIN DASHBOARD */}
        <Route
          path="/admin"
          element={
            isLoggedIn && role === "admin"
              ? <AdminDashboard />
              : <Navigate to="/" replace />
          }
        />

        {/* ADD JOB */}
        <Route
          path="/add-job"
          element={
            isLoggedIn && role === "admin"
              ? <AddJob />
              : <Navigate to="/" replace />
          }
        />

        <Route
  path="/edit-job/:id"
  element={
    isLoggedIn && role === "admin"
      ? <EditJob />
      : <Navigate to="/" replace />
  }
/>

        {/* ADMIN APPLICATIONS */}
        <Route
          path="/admin/applications"
          element={
            isLoggedIn && role === "admin"
              ? <AdminApplications />
              : <Navigate to="/" replace />
          }
        />

        {/* JOB DETAILS */}
        <Route
          path="/job-details"
          element={
            isLoggedIn
              ? <JobDetails />
              : <Navigate to="/" replace />
          }
        />

        {/* PROFILE */}
        <Route
          path="/profile"
          element={
            isLoggedIn
              ? <Profile />
              : <Navigate to="/" replace />
          }
        />

        {/* APPLIED JOBS */}
        <Route
          path="/applied"
          element={
            isLoggedIn && role !== "admin"
              ? <AppliedJobs />
              : <Navigate to="/" replace />
          }
        />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </>
  );
}

export default AppWrapper;
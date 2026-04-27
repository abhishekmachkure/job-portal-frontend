import { Link, useNavigate } from "react-router-dom";
import "./Layout.css";

function Layout({ children }) {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="layout">

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2 className="logo">JobPortal</h2>

        {role === "admin" && (
          <>
            <Link to="/admin">Dashboard</Link>
            <Link to="/add-job">Add Job</Link>
            <Link to="/admin/applications">Applications</Link>
          </>
        )}

        {role !== "admin" && (
          <>
            <Link to="/dashboard">Jobs</Link>
            <Link to="/applied">Applied</Link>
            <Link to="/profile">Profile</Link>
          </>
        )}
      </div>

      {/* MAIN */}
      <div className="main">

        {/* TOP BAR */}
        <div className="topbar">
          <span>Welcome 👋</span>
          <button onClick={handleLogout}>Logout</button>
        </div>

        {/* PAGE CONTENT */}
        <div className="content">
          {children}
        </div>

      </div>
    </div>
  );
}

export default Layout;
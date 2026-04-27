import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Menu,
  X,
  LayoutDashboard,
  Briefcase,
  Users,
  User,
  LogOut,
  LogIn,
  UserPlus
} from "lucide-react";
import "./Header.css";

function Header({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/", { replace: true });
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* LOGO */}
        <h2 className="logo">JobPortal</h2>

        {/* HAMBURGER */}
        <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </div>

        {/* NAV LINKS */}
        <div className={`nav-right ${menuOpen ? "active" : ""}`}>

          {/* USER */}
          {token && role !== "admin" && (
            <>
              <Link to="/dashboard" onClick={closeMenu} className="navlinks">
                <LayoutDashboard size={16} /> Home
              </Link>

              <Link to="/applied" onClick={closeMenu} className="navlinks">
                <Briefcase size={16} /> Applied
              </Link>

              <Link to="/profile" onClick={closeMenu} className="navlinks">
                <User size={16} /> Profile
              </Link>
            </>
          )}

          {/* ADMIN */}
          {token && role === "admin" && (
            <>
              <Link to="/admin" onClick={closeMenu} className="navlinks">
                <LayoutDashboard size={16} /> Dashboard
              </Link>

              <Link to="/add-job" onClick={closeMenu} className="navlinks">
                <Briefcase size={16} /> Add Job
              </Link>

              <Link
                to="/admin/applications"
                onClick={closeMenu}
                className="navlinks"
              >
                <Users size={16} /> Applications
              </Link>
            </>
          )}

          {/* NOT LOGGED */}
          {!token && (
            <>
              <Link to="/" onClick={closeMenu} className="navlinks">
                <LogIn size={16} /> Login
              </Link>

              <Link to="/register" onClick={closeMenu} className="navlinks">
                <UserPlus size={16} /> Register
              </Link>
            </>
          )}

          {/* LOGOUT */}
          {token && (
            <button className="logout-btn" onClick={handleLogout}>
              <LogOut size={16} /> Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;
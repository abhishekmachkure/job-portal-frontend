import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

// ✅ Use environment variable (fallback for safety)
const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

function Login({ setIsLoggedIn }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "user"
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password
        })
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ Save token
        localStorage.setItem("token", data.token);

        // ✅ Decode role
        const decoded = JSON.parse(atob(data.token.split(".")[1]));
        localStorage.setItem("role", decoded.role);

        setIsLoggedIn(true);

        // ✅ Admin check
        if (form.role === "admin" && decoded.role !== "admin") {
          alert("Not an admin ❌");
          return;
        }

        // ✅ Redirect
        if (decoded.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }

      } else {
        alert(data.message || "Login failed");
      }

    } catch (err) {
      console.error("Login error:", err);
      alert("Server error ❌");
    }
  };

  return (
    <div className="login-container">
      <img src="/bg.jpg" alt="bg" className="bg-image" />

      <form className="login-card" onSubmit={handleLogin}>
        <h2>Welcome Back 👋</h2>

        {/* ROLE TOGGLE */}
        <div className="toggle">
          <div
            className={`toggle-btn ${form.role === "admin" ? "active" : ""}`}
          ></div>

          <span
            className={form.role === "user" ? "active-text" : ""}
            onClick={() => setForm({ ...form, role: "user" })}
          >
            User
          </span>

          <span
            className={form.role === "admin" ? "active-text" : ""}
            onClick={() => setForm({ ...form, role: "admin" })}
          >
            Admin
          </span>
        </div>

        <div className="input-box">
          <span>📧</span>
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-box">
          <span>🔒</span>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Login</button>

        <p className="Bold">
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
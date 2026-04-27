import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

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
      const res = await fetch("http://localhost:5000/api/auth/login", {
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
        localStorage.setItem("token", data.token);

        const decoded = JSON.parse(atob(data.token.split(".")[1]));
        localStorage.setItem("role", decoded.role);

        setIsLoggedIn(true);

        if (form.role === "admin" && decoded.role !== "admin") {
          alert("Not an admin ❌");
          return;
        }

        decoded.role === "admin"
          ? navigate("/admin")
          : navigate("/dashboard");

      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <div className="login-container">
      <img src="/bg.jpg" alt="bg" className="bg-image" />

      <form className="login-card" onSubmit={handleLogin}>
        <h2>Welcome Back 👋</h2>

        {/* 🔥 TOGGLE SWITCH */}
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
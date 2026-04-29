import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User } from "lucide-react";
import "./Register.css";

/* ✅ FIX: USE ENV VARIABLE */
const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      return alert("All fields are required");
    }

    if (!form.email.includes("@")) {
      return alert("Enter valid email");
    }

    if (form.password.length < 6) {
      return alert("Password must be at least 6 characters");
    }

    try {
      /* ✅ FIXED API URL */
      const res = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      console.log("Register response:", res.status, data); // ✅ debug

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);

        alert("Registered & Logged in 🎉");

        /* ✅ REDIRECT BASED ON ROLE (small improvement, not logic change) */
        if (data.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }

      } else {
        alert(data.message || "Registration failed ❌");
      }

    } catch (err) {
      console.log(err);
      alert("Server error ❌");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <h1 className="auth-title">Create Account ✨</h1>

        <form onSubmit={handleRegister}>

          <div className="input-box">
            <User size={18} />
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="input-box">
            <Mail size={18} />
            <input
              name="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="input-box">
            <Lock size={18} />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="auth-btn">
            Register
          </button>

        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <span onClick={() => navigate("/")}>Login</span>
        </p>

      </div>
    </div>
  );
}

export default Register;
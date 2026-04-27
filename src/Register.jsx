import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User } from "lucide-react";
import "./Register.css";

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
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);

        alert("Registered & Logged in 🎉");
        navigate("/dashboard");
      } else {
        alert(data.message);
      }
    } catch {
      alert("Server error");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <h1 className="auth-title">Create Account ✨</h1>

        {/* INPUTS */}
        <form onSubmit={handleRegister}>

          <div className="input-box">
            <User size={18} />
            <input
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
            />
          </div>

          <div className="input-box">
            <Mail size={18} />
            <input
              name="email"
              placeholder="Email address"
              onChange={handleChange}
            />
          </div>

          <div className="input-box">
            <Lock size={18} />
            <input
              type="password"
              name="password"
              placeholder="Password"
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
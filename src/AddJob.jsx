import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, Building2, MapPin, IndianRupee } from "lucide-react";
import "./AddJob.css";

/* ✅ FIX: USE ENV VARIABLE */
const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

function AddJob() {
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    skills: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.company || !form.location || !form.salary) {
      return setMessage("Please fill all fields");
    }

    setLoading(true);
    setMessage("");

    try {
      /* ✅ FIX: USE API VARIABLE */
      const res = await fetch(`${API}/api/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Error adding job ❌");
      } else {
        setMessage("Job added successfully ✅");

        setForm({
          title: "",
          company: "",
          location: "",
          salary: "",
          skills: ""
        });

        setTimeout(() => navigate("/admin"), 1200);
      }

    } catch (err) {
      console.log(err);
      setMessage("Server error ❌");
    }

    setLoading(false);
  };

  return (
    <div className="addjob-container">
      <div className="addjob-card">
        <h2>Add New Job</h2>

        {message && <p className="form-message">{message}</p>}

        <form onSubmit={handleSubmit} className="addjob-form">

          <div className="input-group">
            <Briefcase size={18} />
            <input
              name="title"
              placeholder="Job Title"
              value={form.title}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <Building2 size={18} />
            <input
              name="company"
              placeholder="Company Name"
              value={form.company}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <MapPin size={18} />
            <input
              name="location"
              placeholder="Location"
              value={form.location}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <IndianRupee size={18} />
            <input
              name="salary"
              placeholder="Salary (e.g. 10 LPA)"
              value={form.salary}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <Briefcase size={18} />
            <input
              name="skills"
              placeholder="Skills (e.g. React, Node, MongoDB)"
              value={form.skills}
              onChange={handleChange}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Job"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default AddJob;
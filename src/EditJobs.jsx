import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Briefcase, Building2, MapPin, IndianRupee } from "lucide-react";
import "./EditJobs.css";

// ✅ API URL FIX
const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    skills: ""
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  /* ================= FETCH JOB ================= */
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`${API}/api/jobs/${id}`);

        const data = await res.json();

        if (!res.ok) {
          alert("Job not found ❌");
          return navigate("/admin");
        }

        setForm({
          title: data.title || "",
          company: data.company || "",
          location: data.location || "",
          salary: data.salary || "",
          skills: data.skills || ""
        });

      } catch (err) {
        console.error(err);
        alert("Failed to load job ❌");
        navigate("/admin");
      }

      setLoading(false);
    };

    fetchJob();
  }, [id, navigate]);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= UPDATE JOB ================= */
  const handleUpdate = async (e) => {
    e.preventDefault();

    setUpdating(true);
    setMessage("");

    try {
      const res = await fetch(`${API}/api/jobs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Update failed ❌");
      } else {
        setMessage("Job updated successfully 🎉");

        setTimeout(() => {
          navigate("/admin");
        }, 1200);
      }

    } catch (err) {
      console.error(err);
      setMessage("Server error ❌");
    }

    setUpdating(false);
  };

  if (loading) {
    return <p style={{ padding: "20px" }}>Loading...</p>;
  }

  return (
    <div className="editjob-container">
      <div className="editjob-card">
        <h2>Edit Job</h2>

        {message && <p className="form-message">{message}</p>}

        <form onSubmit={handleUpdate} className="editjob-form">

          <div className="input-group">
            <Briefcase size={18} />
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <Building2 size={18} />
            <input
              name="company"
              value={form.company}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <MapPin size={18} />
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <IndianRupee size={18} />
            <input
              name="salary"
              value={form.salary}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <Briefcase size={18} />
            <input
              name="skills"
              value={form.skills}
              onChange={handleChange}
              placeholder="Skills"
            />
          </div>

          <button type="submit" disabled={updating}>
            {updating ? "Updating..." : "Update Job"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default EditJob;
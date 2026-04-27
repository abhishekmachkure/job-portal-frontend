import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Briefcase, Building2, MapPin, IndianRupee } from "lucide-react";
import "./EditJobs.css";

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

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/jobs/${id}`);
        if (!res.ok) return navigate("/admin");

        const data = await res.json();

        setForm({
          title: data.title || "",
          company: data.company || "",
          location: data.location || "",
          salary: data.salary || "",
          skills: data.skills || ""
        });

        setLoading(false);
      } catch {
        navigate("/admin");
      }
    };

    fetchJob();
  }, [id, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    setUpdating(true);
    setMessage("");

    try {
      const res = await fetch(`http://localhost:5000/api/jobs/${id}`, {
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
        setTimeout(() => navigate("/admin"), 1200);
      }

    } catch {
      setMessage("Server error ❌");
    }

    setUpdating(false);
  };

  if (loading) return <p style={{ padding: "20px" }}>Loading...</p>;

  return (
    <div className="editjob-container">
      <div className="editjob-card">
        <h2>Edit Job</h2>

        {message && <p className="form-message">{message}</p>}

        <form onSubmit={handleUpdate} className="editjob-form">

          <div className="input-group">
            <Briefcase size={18} />
            <input name="title" value={form.title} onChange={handleChange} />
          </div>

          <div className="input-group">
            <Building2 size={18} />
            <input name="company" value={form.company} onChange={handleChange} />
          </div>

          <div className="input-group">
            <MapPin size={18} />
            <input name="location" value={form.location} onChange={handleChange} />
          </div>

          <div className="input-group">
            <IndianRupee size={18} />
            <input name="salary" value={form.salary} onChange={handleChange} />
          </div>

          {/* SKILLS */}
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
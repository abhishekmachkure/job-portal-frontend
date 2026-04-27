import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { MapPin, Building2, IndianRupee } from "lucide-react";
import "./JobDetails.css";

// ✅ FIX: use environment variable
const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

function JobDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const job = location.state;

  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(false);

  const token = localStorage.getItem("token");

  /* ================= REDIRECT IF NO JOB ================= */
  useEffect(() => {
    if (!job) {
      navigate("/dashboard");
    }
  }, [job, navigate]);

  /* ================= CHECK APPLIED ================= */
  useEffect(() => {
    const fetchApplied = async () => {
      try {
        const res = await fetch(`${API}/api/my-applications`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();

        if (!Array.isArray(data)) return;

        const ids = data
          .filter((app) => app.job)
          .map((app) => app.job._id.toString());

        if (ids.includes(job._id.toString())) {
          setApplied(true);
        }

      } catch (err) {
        console.error(err);
      }
    };

    if (token && job) fetchApplied();
  }, [token, job]);

  /* ================= APPLY ================= */
  const handleApply = async () => {
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ jobId: job._id })
      });

      const data = await res.json();

      if (res.ok || data.message === "Already applied") {
        setApplied(true);

        // ✅ sync with dashboard
        const stored = JSON.parse(localStorage.getItem("appliedJobs")) || [];

        if (!stored.includes(job._id)) {
          localStorage.setItem(
            "appliedJobs",
            JSON.stringify([...stored, job._id])
          );
        }

      } else {
        alert(data.message || "Failed to apply ❌");
      }

    } catch (err) {
      console.error(err);
      alert("Server error ❌");
    }

    setLoading(false);
  };

  if (!job) return null;

  return (
    <div className="jd-container">
      <div className="jd-card">

        <h1 className="jd-title">{job.title}</h1>

        <div className="jd-info">
          <div className="jd-item">
            <Building2 size={18} />
            <span>{job.company}</span>
          </div>

          <div className="jd-item">
            <MapPin size={18} />
            <span>{job.location}</span>
          </div>

          <div className="jd-item">
            <IndianRupee size={18} />
            <span>{job.salary}</span>
          </div>
        </div>

        {/* SKILLS */}
        <div className="jd-skills">
          {job.skills
            ? job.skills.split(",").map((skill, index) => (
                <span key={index}>{skill.trim()}</span>
              ))
            : <span>No skills</span>}
        </div>

        {/* APPLY BUTTON */}
        <button
          className={`jd-apply-btn ${applied ? "applied" : ""}`}
          onClick={handleApply}
          disabled={loading || applied}
        >
          {applied
            ? "Applied ✔"
            : loading
            ? "Applying..."
            : "Apply Now"}
        </button>

      </div>
    </div>
  );
}

export default JobDetails;
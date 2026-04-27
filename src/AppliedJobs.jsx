import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  Calendar,
  Eye,
  Trash2
} from "lucide-react";
import "./AppliedJobs.css";

function AppliedJobs() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  /* ================= FETCH ================= */
  useEffect(() => {
    if (!token) return;

    const fetchApplications = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/my-applications", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();
        setApps(data);

      } catch (err) {
        console.log(err);
      }

      setLoading(false);
    };

    fetchApplications();
  }, [token]);

  /* ================= WITHDRAW ================= */
  const handleWithdraw = async (id) => {
    if (!window.confirm("Withdraw this application?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/applications/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        setApps((prev) => prev.filter((app) => app._id !== id));
      }

    } catch (err) {
      console.log(err);
    }
  };

  /* ================= STATS ================= */
  const total = apps.length;
  const pending = apps.filter(a => a.status === "applied").length;
  const accepted = apps.filter(a => a.status === "accepted").length;
  const rejected = apps.filter(a => a.status === "rejected").length;

  return (
    <div className="applied-container">

      {/* HEADER */}
      <div className="page-header">
        <h2>📄 Applied Jobs</h2>
        <p>Track your application status</p>
      </div>

      {/* STATS */}
      <div className="stats">
        <div className="stat-card total">
          <h3>{total}</h3>
          <p>Total</p>
        </div>

        <div className="stat-card pending">
          <h3>{pending}</h3>
          <p>Pending</p>
        </div>

        <div className="stat-card accepted">
          <h3>{accepted}</h3>
          <p>Accepted</p>
        </div>

        <div className="stat-card rejected">
          <h3>{rejected}</h3>
          <p>Rejected</p>
        </div>
      </div>

      {/* CONTENT */}
      {loading ? (
        <p className="loading">Loading applications...</p>
      ) : apps.length === 0 ? (
        <p className="empty">No applications yet</p>
      ) : (
        <div className="applied-grid">

          {apps.map((app) => (
            <div key={app._id} className="applied-card">

              {/* TITLE */}
              <h3>{app.job?.title || "Job not available"}</h3>

              {/* COMPANY */}
              <p className="company">
                <Briefcase size={14} /> {app.job?.company || "Unknown"}
              </p>

              {/* DATE */}
              <p className="date">
                <Calendar size={14} />
                {app.createdAt
                  ? new Date(app.createdAt).toLocaleDateString()
                  : "Not available"}
              </p>

              {/* SKILLS */}
              <div className="job-skills">
                {app.job?.skills
                  ? app.job.skills.split(",").map((skill, i) => (
                      <span key={i}>{skill.trim()}</span>
                    ))
                  : <span className="no-skill">No skills</span>
                }
              </div>

              {/* STATUS */}
              <div className={`status ${app.status}`}>
                <span className="status-dot"></span>
                {app.status.toUpperCase()}
              </div>

              {/* ACTIONS */}
              <div className="actions">

                <button
                  className="view-btn"
                  onClick={() =>
                    navigate("/job-details", { state: app.job })
                  }
                >
                  <Eye size={14} /> View Job
                </button>

                <button
                  className="delete-btn"
                  onClick={() => handleWithdraw(app._id)}
                >
                  <Trash2 size={14} /> Withdraw
                </button>

              </div>

            </div>
          ))}

        </div>
      )}
    </div>
  );
}

export default AppliedJobs;
import { useEffect, useState, useCallback } from "react";
import {
  User,
  Mail,
  Briefcase,
  FileText
} from "lucide-react";
import "./AdminApplications.css";

/* ✅ FIX: use env instead of localhost */
const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

function AdminApplications() {
  const [apps, setApps] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const token = localStorage.getItem("token");

  /* ✅ FIXED fetchApps */
  const fetchApps = useCallback(async () => {
    try {
      if (!token) {
        console.log("No token found");
        return;
      }

      const res = await fetch(`${API}/api/applications`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();

      /* ✅ FIX: check response */
      if (res.ok) {
        setApps(data);
      } else {
        console.log("API Error:", data.message);
      }

    } catch (err) {
      console.log("Fetch error:", err);
    }
  }, [token]);

  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(
        `${API}/api/applications/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ status })
        }
      );

      /* ✅ FIX: refresh only if success */
      if (res.ok) {
        fetchApps();
      } else {
        const data = await res.json();
        console.log("Update error:", data.message);
      }

    } catch (err) {
      console.log("Update error:", err);
    }
  };

  const filteredApps = apps.filter((app) => {
    const name = app.user?.name?.toLowerCase() || "";
    const email = app.user?.email?.toLowerCase() || "";
    const job = app.job?.title?.toLowerCase() || "";

    return (
      (name.includes(search.toLowerCase()) ||
        email.includes(search.toLowerCase()) ||
        job.includes(search.toLowerCase())) &&
      (statusFilter === "all" || app.status === statusFilter)
    );
  });

  const total = apps.length;
  const pending = apps.filter((a) => a.status === "applied").length;
  const accepted = apps.filter((a) => a.status === "accepted").length;
  const rejected = apps.filter((a) => a.status === "rejected").length;

  return (
    <div className="admin-container">
      <h2>Applications</h2>

      <div className="stats">
        <div className="stat-card applied"><h3>{total}</h3><p>Total</p></div>
        <div className="stat-card pending"><h3>{pending}</h3><p>Pending</p></div>
        <div className="stat-card accepted"><h3>{accepted}</h3><p>Accepted</p></div>
        <div className="stat-card rejected"><h3>{rejected}</h3><p>Rejected</p></div>
      </div>

      <div className="filters">
        <input
          placeholder="Search by name, email, job..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="applied">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {filteredApps.length === 0 ? (
        <p className="empty">No applications found</p>
      ) : (
        <div className="admin-grid">
          {filteredApps.map((app) => (
            <div key={app._id} className="admin-card">

              <h3>{app.job?.title}</h3>
              <p className="company">{app.job?.company}</p>

              <hr />

              <p><User size={14}/> {app.user?.name}</p>
              <p><Mail size={14}/> {app.user?.email}</p>

              <p>
                <Briefcase size={14}/> {" "}
                {app.user?.skills?.length > 0
                  ? app.user.skills.join(", ")
                  : "Not provided"}
              </p>

              <p>
                <FileText size={14}/> {" "}
                {app.user?.resume ? (
                  <a href={app.user.resume} target="_blank" rel="noreferrer">
                    View Resume
                  </a>
                ) : "Not uploaded"}
              </p>

              <div className={`status ${app.status}`}>
                {app.status.toUpperCase()}
              </div>

              <div className="actions">
                <button
                  className="accept"
                  disabled={app.status !== "applied"}
                  onClick={() => updateStatus(app._id, "accepted")}
                >
                  Accept
                </button>

                <button
                  className="reject"
                  disabled={app.status !== "applied"}
                  onClick={() => updateStatus(app._id, "rejected")}
                >
                  Reject
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminApplications;
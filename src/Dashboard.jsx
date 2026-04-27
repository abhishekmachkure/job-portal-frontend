import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  IndianRupee,
  Trash,
  Edit,
  Send
} from "lucide-react";
import "./Dashboard.css";

function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [appliedJobs, setAppliedJobs] = useState([]);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  /* PROTECT */
  useEffect(() => {
    if (!token) navigate("/", { replace: true });
  }, [token, navigate]);

  /* LOAD FROM LOCALSTORAGE (FAST UI) */
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("appliedJobs")) || [];
    setAppliedJobs(stored);
  }, []);

  /* FETCH JOBS */
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/jobs");
        const data = await res.json();
        setJobs(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchJobs();
  }, []);

  /* FETCH APPLIED FROM BACKEND (SYNC) */
  useEffect(() => {
    const fetchApplied = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/my-applications", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();

        const ids = data
          .filter((app) => app.job) // avoid null
          .map((app) => app.job._id.toString());

        setAppliedJobs(ids);

        // ✅ store for persistence
        localStorage.setItem("appliedJobs", JSON.stringify(ids));

      } catch (err) {
        console.log(err);
      }
    };

    if (token) fetchApplied();
  }, [token]);

  /* DELETE */
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/jobs/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        setJobs((prev) => prev.filter((job) => job._id !== id));
      }
    } catch (err) {
      console.log(err);
    }
  };

  /* APPLY */
  const handleApply = async (job) => {
    try {
      const res = await fetch("http://localhost:5000/api/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ jobId: job._id })
      });

      const data = await res.json();
      const id = job._id.toString();

      if (res.ok || data.message === "Already applied") {
        setAppliedJobs((prev) => {
          if (prev.includes(id)) return prev;
          const updated = [...prev, id];

          // ✅ store in localStorage
          localStorage.setItem("appliedJobs", JSON.stringify(updated));

          return updated;
        });
      } else {
        alert(data.message);
      }

    } catch (err) {
      console.log(err);
      alert("Server error");
    }
  };

  /* FILTER */
  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(search.toLowerCase()) &&
      job.location.toLowerCase().includes(locationFilter.toLowerCase())
  );

  return (
    <div className="container">

      <div className="dashboard-header">
        <h1>Find Your Dream Job 🚀</h1>
        <p>Explore opportunities tailored for you</p>
      </div>

      <div className="filters">
        <div className="input-box">
          <Search size={16} />
          <input
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="input-box">
          <MapPin size={16} />
          <input
            placeholder="Location..."
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          />
        </div>
      </div>

      {filteredJobs.length === 0 ? (
        <p className="empty">No jobs found</p>
      ) : (
        <div className="grid-3">
          {filteredJobs.map((job) => {
            const isApplied = appliedJobs.includes(job._id.toString());

            return (
              <div key={job._id} className="card job-card">

                <h3
                  className="clickable"
                  onClick={() =>
                    navigate("/job-details", { state: job })
                  }
                >
                  {job.title}
                </h3>

                <p className="company">{job.company}</p>

                <div className="job-info">
                  <span><MapPin size={14} /> {job.location}</span>
                  <span><IndianRupee size={14} /> {job.salary}</span>
                </div>

                <div className="job-skills">
                  {job.skills
                    ? job.skills.split(",").map((skill, index) => (
                        <span key={index}>{skill.trim()}</span>
                      ))
                    : <span className="no-skill">No skills</span>
                  }
                </div>

                <div className="job-actions">
                  {role === "admin" && (
                    <>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(job._id)}
                      >
                        <Trash size={14} /> Delete
                      </button>

                      <button
                        className="btn btn-primary"
                        onClick={() => navigate(`/edit-job/${job._id}`)}
                      >
                        <Edit size={14} /> Edit
                      </button>
                    </>
                  )}

                  {role !== "admin" && (
                    <button
                      className={`btn btn-success ${isApplied ? "disabled" : ""}`}
                      disabled={isApplied}
                      onClick={() => handleApply(job)}
                    >
                      <Send size={14} />
                      {isApplied ? " Applied ✔" : " Apply"}
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
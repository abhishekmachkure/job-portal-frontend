import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  Users,
  Plus,
  Eye,
  Edit,
  Trash
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import "./AdminDashboard.css";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

function AdminDashboard() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  /* ✅ FIXED */
  const fetchJobs = useCallback(async () => {
    const res = await fetch(`${API}/api/jobs`);
    const data = await res.json();
    setJobs(data);
  }, []);

  const fetchApplications = useCallback(async () => {
    const res = await fetch(`${API}/api/applications`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setApplications(data);
  }, [token]);

  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, [fetchJobs, fetchApplications]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete job?")) return;

    await fetch(`${API}/api/jobs/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    setJobs((prev) => prev.filter((job) => job._id !== id));
  };

  const chartData = [
    { name: "Jobs", value: jobs.length },
    { name: "Applications", value: applications.length }
  ];

  return (
    <div className="container">

      <div className="dashboard-header">
        <h1>Admin Dashboard 👑</h1>
        <p>Manage jobs and track applications</p>
      </div>

      <div className="dashboard-row">
        <div className="card chart-box">
          <h3>Analytics Overview</h3>

          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mini-stats">
          <div className="card mini-card">
            <Briefcase size={26} />
            <h3>{jobs.length}</h3>
            <p>Total Jobs</p>
          </div>

          <div className="card mini-card">
            <Users size={26} />
            <h3>{applications.length}</h3>
            <p>Total Applications</p>
          </div>
        </div>
      </div>

      <div className="actions">
        <button className="btn btn-success" onClick={() => navigate("/add-job")}>
          <Plus size={16} /> Add Job
        </button>

        <button className="btn btn-primary" onClick={() => navigate("/admin/applications")}>
          <Eye size={16} /> View Applications
        </button>
      </div>

      <div className="jobs-section">
        <div className="section-header">
          <h2>💼 Jobs</h2>
          <p>Manage all available job listings</p>
        </div>

        <div className="grid-3">
          {jobs.map((job) => (
            <div key={job._id} className="card job-card">

              <h3>{job.title}</h3>
              <p className="company">{job.company}</p>
              <p className="location">{job.location}</p>

              <div className="job-skills">
                {job.skills
                  ? job.skills.split(",").map((skill, i) => (
                      <span key={i}>{skill.trim()}</span>
                    ))
                  : <span>No skills</span>}
              </div>

              <div className="job-actions">
                <button onClick={() => navigate(`/edit-job/${job._id}`)}>
                  <Edit size={14}/> Edit
                </button>

                <button onClick={() => handleDelete(job._id)}>
                  <Trash size={14}/> Delete
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default AdminDashboard;
import { useState, useEffect, useCallback } from "react";
import {
  Mail,
  MapPin,
  Phone,
  GraduationCap,
  Globe,
  FileText,
  User
} from "lucide-react";
import "./Profile.css";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  /* ✅ FIXED useCallback */
  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      setProfile(data);
      setForm(data);

    } catch {
      setError("Failed to load profile");
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchProfile();
  }, [fetchProfile, token]);

  const handleUpdate = async () => {
    try {
      const res = await fetch(`${API}/api/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      if (!res.ok) throw new Error();

      setIsEditing(false);
      fetchProfile();

    } catch {
      alert("Update failed ❌");
    }
  };

  if (error) return <p className="loading">{error}</p>;
  if (!profile) return <p className="loading">Loading...</p>;

  return (
    <div className="profile-container">

      {/* HEADER */}
      <div className="profile-header">
        <div className="avatar">
          <User size={20} /> {/* ✅ USED */}
        </div>

        <div>
          <h2>{profile.name}</h2>
          <button onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? "Cancel" : "Edit"}
          </button>
        </div>
      </div>

      {/* BASIC INFO */}
      <div className="card">
        <p><Mail size={16}/> {profile.email}</p>
        <p><Phone size={16}/> {profile.phone || "Not added"}</p>
        <p><MapPin size={16}/> {profile.location || "Not added"}</p>
        <p><GraduationCap size={16}/> {profile.education || "Not added"}</p>
        <p><Globe size={16}/> {profile.linkedin || "Not added"}</p> {/* ✅ USED */}
      </div>

      {/* SKILLS */}
      <div className="card">
        <h3>🧠 Skills</h3>
        {profile.skills?.length > 0
          ? profile.skills.map((s, i) => <span key={i}>{s}</span>)
          : <p>No skills</p>}
      </div>

      {/* RESUME */}
      <div className="card">
        <h3><FileText size={16}/> Resume</h3> {/* ✅ USED */}
        {profile.resume ? (
          <a href={profile.resume} target="_blank" rel="noreferrer">
            View Resume
          </a>
        ) : (
          "No resume"
        )}
      </div>

      {/* EDIT MODE */}
      {isEditing && (
        <div className="card">
          <h3>Edit Profile</h3>

          <input
            value={form.name || ""}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Name"
          />

          <input
            value={form.phone || ""}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="Phone"
          />

          <input
            value={form.location || ""}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="Location"
          />

          <input
            value={form.education || ""}
            onChange={(e) => setForm({ ...form, education: e.target.value })}
            placeholder="Education"
          />

          <input
            value={form.linkedin || ""}
            onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
            placeholder="LinkedIn URL"
          />

          <input
            value={form.skills?.join(",") || ""}
            onChange={(e) =>
              setForm({ ...form, skills: e.target.value.split(",") })
            }
            placeholder="Skills (comma separated)"
          />

          <input
            value={form.resume || ""}
            onChange={(e) => setForm({ ...form, resume: e.target.value })}
            placeholder="Resume link"
          />

          <button onClick={handleUpdate}>Save</button>
        </div>
      )}
    </div>
  );
}

export default Profile;
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

  /* ✅ FIXED */
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

      <div className="profile-header">
        <div className="avatar">{profile.name?.charAt(0)}</div>

        <div>
          <h2>{profile.name}</h2>
          <button onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? "Cancel" : "Edit"}
          </button>
        </div>
      </div>

      <div className="card">
        <p><Mail/> {profile.email}</p>
        <p><Phone/> {profile.phone || "Not added"}</p>
        <p><MapPin/> {profile.location || "Not added"}</p>
        <p><GraduationCap/> {profile.education || "Not added"}</p>
      </div>

      <div className="card">
        <h3>Skills</h3>
        {profile.skills?.length > 0
          ? profile.skills.map((s, i) => <span key={i}>{s}</span>)
          : "No skills"}
      </div>

      <div className="card">
        <h3>Resume</h3>
        {profile.resume
          ? <a href={profile.resume} target="_blank" rel="noreferrer">View</a>
          : "No resume"}
      </div>

      {isEditing && (
        <button onClick={handleUpdate}>Save</button>
      )}
    </div>
  );
}

export default Profile;
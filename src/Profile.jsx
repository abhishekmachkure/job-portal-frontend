import { useState, useEffect } from "react";
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

function Profile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  /* FETCH PROFILE */
  const fetchProfile = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/user/profile", {
       headers: {
  Authorization: token ? `Bearer ${token}` : ""
}
      });

      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();

      setProfile(data);
      setForm(data);

    } catch (err) {
      console.log(err);
      setError("Failed to load profile");
    }
  };

  useEffect(() => {
    if (token) fetchProfile();
  }, [token]);

  /* UPDATE PROFILE */
  const handleUpdate = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/user/profile", {
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

  /* PROFILE COMPLETION */
  const fields = [
    profile.name,
    profile.email,
    profile.education,
    profile.skills?.length,
    profile.resume,
    profile.phone,
    profile.location,
    profile.linkedin
  ];

  const filled = fields.filter(Boolean).length;
  const completion = Math.round((filled / fields.length) * 100);

  return (
    <div className="profile-container">

      {/* HEADER */}
      <div className="profile-header">
        <div className="avatar">
          {profile.name?.charAt(0)}
        </div>

        <div className="header-info">
          <h2>{profile.name}</h2>
          <p>Manage your profile</p>

          <div className="progress">
            <div style={{ width: `${completion}%` }}></div>
          </div>
          <span className="progress-text">{completion}% completed</span>
        </div>

        <button onClick={() => setIsEditing(!isEditing)} className="edit-btn">
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>

      {/* BASIC INFO */}
      <div className="card">
        <h3><User size={16}/> Basic Information</h3>

        {!isEditing ? (
          <>
            <p><Mail size={14}/> {profile.email}</p>
            <p><GraduationCap size={14}/> {profile.education || "Not added"}</p>
            <p><Phone size={14}/> {profile.phone || "Not added"}</p>
            <p><MapPin size={14}/> {profile.location || "Not added"}</p>
          </>
        ) : (
          <>
            <input value={form.name || ""} onChange={(e)=>setForm({...form,name:e.target.value})} placeholder="Name"/>
            <input value={form.education || ""} onChange={(e)=>setForm({...form,education:e.target.value})} placeholder="Education"/>
            <input value={form.phone || ""} onChange={(e)=>setForm({...form,phone:e.target.value})} placeholder="Phone"/>
            <input value={form.location || ""} onChange={(e)=>setForm({...form,location:e.target.value})} placeholder="Location"/>
          </>
        )}
      </div>

      {/* SKILLS */}
      <div className="card">
        <h3>🧠 Skills</h3>

        {!isEditing ? (
          <div className="skills">
            {profile.skills?.length > 0
              ? profile.skills.map((s, i) => <span key={i}>{s}</span>)
              : <p>No skills added</p>}
          </div>
        ) : (
          <input
            value={form.skills?.join(",") || ""}
            onChange={(e)=>setForm({...form,skills:e.target.value.split(",")})}
            placeholder="React, Node, MongoDB"
          />
        )}
      </div>

      {/* LINKEDIN */}
      <div className="card">
        <h3>🔗 LinkedIn</h3>

        {!isEditing ? (
          <p>
            <Globe size={14}/> 
            {profile.linkedin || "Not added"}
          </p>
        ) : (
          <input
            value={form.linkedin || ""}
            onChange={(e)=>setForm({...form,linkedin:e.target.value})}
            placeholder="LinkedIn URL"
          />
        )}
      </div>

      {/* RESUME */}
      <div className="card">
        <h3><FileText size={16}/> Resume</h3>

        {!isEditing ? (
          profile.resume ? (
            <div className="resume-actions">
              <a href={profile.resume} target="_blank" rel="noreferrer">View</a>
              <a href={profile.resume} download>Download</a>
            </div>
          ) : (
            <p>No resume uploaded</p>
          )
        ) : (
          <input
            value={form.resume || ""}
            onChange={(e)=>setForm({...form,resume:e.target.value})}
            placeholder="Resume link"
          />
        )}
      </div>

      {/* SAVE BUTTON */}
      {isEditing && (
        <button className="save-btn" onClick={handleUpdate}>
          Save Changes
        </button>
      )}
    </div>
  );
}

export default Profile;
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Profile() {
  const [userId, setUserId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const user = parseJwt(token);
      const uid = user?._id || user?.id || user?.userId || user?.sub;
      if (uid) {
        setUserId(uid);
        fetchProfile(uid);
      }
    }
  }, []);

  const fetchProfile = async (id) => {
    try {
      const res = await axios.get(`http://localhost:3000/getProfile/${id}`);
      setProfile(res.data.data);
      setFormData(res.data.data);
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'resume') {
      setFormData({ ...formData, resume: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      const res = await axios.put(`http://localhost:3000/editprofile/${userId}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProfile(res.data.data.data);
      setEditMode(false);
      setMessage('✅ Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      setMessage('❌ Failed to update profile.');
    }
  };

  if (!profile) {
    return <div className="text-center mt-10 text-gray-600">Loading profile...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 bg-white shadow-lg rounded-xl border">
      <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">👤 My Profile</h2>

      {message && (
        <p className={`mb-6 text-center text-lg font-medium ${message.includes("success") ? "text-green-600" : "text-red-500"}`}>
          {message}
        </p>
      )}

      {editMode ? (
        <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input name="email" value={formData.email || ''} onChange={handleChange} placeholder="Email" className={input} />
          <input name="phone" value={formData.phone || ''} onChange={handleChange} placeholder="Phone" className={input} />
          <input name="location" value={formData.location || ''} onChange={handleChange} placeholder="Location" className={input} />
          <input name="skill" value={formData.skill || ''} onChange={handleChange} placeholder="Skills" className={input} />
          <input name="education" value={formData.education || ''} onChange={handleChange} placeholder="Education" className={input} />
          <div>
            <label className="block text-sm font-medium mb-1">Upload Resume:</label>
            <input type="file" name="resume" onChange={handleChange} className="w-full border rounded px-3 py-2" />
            {formData.resume && typeof formData.resume === 'object' && (
              <p className="text-sm text-gray-500 mt-1">Selected: {formData.resume.name}</p>
            )}
          </div>
          <div className="col-span-2 flex justify-center gap-4 mt-4">
            <button type="submit" className={btnPrimary}>💾 Save</button>
            <button type="button" className={btnSecondary} onClick={() => setEditMode(false)}>Cancel</button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
          <p><strong>Email:</strong> {profile.email || 'N/A'}</p>
          <p><strong>Phone:</strong> {profile.phone || 'N/A'}</p>
          <p><strong>Location:</strong> {profile.location || 'N/A'}</p>
          <p><strong>Skills:</strong> {profile.skill || 'N/A'}</p>
          <p><strong>Education:</strong> {profile.education || 'N/A'}</p>
          <p>
  <strong>Resume:</strong>{' '}
  {profile.resume ? (
    <div className="flex flex-col gap-1">
      <a
        href={`http://localhost:3000/uploads/${profile.resume}`}
        target="_blank"
        rel="noreferrer"
        className="text-blue-600 underline hover:text-blue-800"
      >
        🔍 View Resume
      </a>
      <a
        href={`http://localhost:3000/uploads/${profile.resume}`}
        download
        className="text-green-600 underline hover:text-green-800"
      >
        ⬇️ Download Resume
      </a>
    </div>
  ) : 'N/A'}
</p>

          <div className="col-span-2 text-center mt-6">
            <button onClick={() => setEditMode(true)} className={btnPrimary}>✏️ Edit Profile</button>
          </div>
        </div>
      )}
    </div>
  );
}

// 🔐 Helper function to decode JWT
function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (error) {
    console.error('Error parsing token:', error);
    return null;
  }
}

// Tailwind utility classes
const input = 'w-full border rounded px-4 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500';
const btnBase = 'px-4 py-2 rounded text-white font-medium shadow';
const btnPrimary = `${btnBase} bg-blue-600 hover:bg-blue-700`;
const btnSecondary = `${btnBase} bg-gray-500 hover:bg-gray-600`;

export default Profile;

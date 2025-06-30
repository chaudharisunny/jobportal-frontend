import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import API from '../utils/api';

const ApplicantProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get(`/applicant-profile/${userId}`);
        setUser(res.data.applicant);
      } catch (err) {
        console.error('❌ Error loading user profile:', err);
        setError('User not found or server error.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">👤 Applicant Profile</h1>
        <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          {user.phone && <p><strong>Phone:</strong> {user.phone}</p>}
          {user.skills && (
            <p>
              <strong>Skills:</strong>{' '}
              {Array.isArray(user.skills) ? user.skills.join(', ') : user.skills}
            </p>
          )}
          {user.resumeName && (
            <div className="mt-4 space-x-2">
              <a
                href={`${import.meta.env.VITE_API_URL || 'https://jobportal-backend-d315.onrender.com'}/resume/${encodeURIComponent(user.resumeName)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white bg-green-600 px-4 py-2 rounded hover:bg-green-700"
              >
                View Resume
              </a>
              <a
                href={`${import.meta.env.VITE_API_URL || 'https://jobportal-backend-d315.onrender.com'}/resume/${encodeURIComponent(user.resumeName)}`}
                download
                className="text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
              >
                Download Resume
              </a>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ApplicantProfile;

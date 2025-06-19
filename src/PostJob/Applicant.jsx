import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

const Applicant = () => {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(null);

  useEffect(() => {
    const fetchApplicants = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) return;

      try {
        const res = await axios.get(`http://localhost:3000/job/${jobId}/applicant`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const baseURL = 'http://localhost:3000';
        const formatted = res.data.applicants.map((user) => ({
          ...user,
          resumeUrl: user.resumeName
            ? `${baseURL}/resume/${encodeURIComponent(user.resumeName)}`
            : null,
        }));

        setApplicants(formatted);
      } catch (error) {
        console.error('Failed to fetch applicants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [jobId]);

  const handleStatusUpdate = async (applicantId, status) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setStatusUpdating(applicantId + status);
    try {
      await axios.put(
        `http://localhost:3000/application/${applicantId}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setApplicants((prev) =>
        prev.map((applicant) =>
          applicant._id === applicantId ? { ...applicant, status } : applicant
        )
      );
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setStatusUpdating(null);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6">
        <h1 className="text-2xl font-semibold mb-6">
          Applicants for Job: <span className="text-blue-600 break-all">{jobId}</span>
        </h1>

        {loading ? (
          <p className="text-gray-500">Loading applicants...</p>
        ) : applicants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {applicants.map((user) => (
              <div
                key={user._id}
                className="bg-white p-6 rounded-xl shadow-md border border-gray-200"
              >
                <h2 className="text-lg font-bold mb-1">{user.username || 'Unnamed User'}</h2>
                <p className="text-gray-600 mb-1">📧 {user.email || 'N/A'}</p>
                {user.phone && <p className="text-gray-600 mb-1">📱 {user.phone}</p>}
                {user.skills && (
                  <p className="text-gray-600 mb-1">
                    🛠 Skills: {Array.isArray(user.skills) ? user.skills.join(', ') : user.skills}
                  </p>
                )}

                {user.resumeUrl ? (
                  <div className="mt-3 flex gap-2 flex-wrap">
                    <a
                      href={user.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
                    >
                      View Resume
                    </a>
                    <a
                      href={user.resumeUrl}
                      download
                      className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
                    >
                      Download
                    </a>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic mt-2">No resume uploaded</p>
                )}

                <p className="text-sm mt-4">
                  Status:{' '}
                  <span
                    className={`font-medium ${
                      user.status === 'hired'
                        ? 'text-green-600'
                        : user.status === 'rejected'
                        ? 'text-red-600'
                        : 'text-gray-500'
                    }`}
                  >
                    {user.status || 'Pending'}
                  </span>
                </p>

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => handleStatusUpdate(user._id, 'hired')}
                    className="text-white bg-green-500 hover:bg-green-600 px-3 py-1 rounded text-sm disabled:opacity-50"
                    disabled={statusUpdating === user._id + 'hired'}
                  >
                    {statusUpdating === user._id + 'hired' ? 'Hiring...' : 'Hire'}
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(user._id, 'rejected')}
                    className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm disabled:opacity-50"
                    disabled={statusUpdating === user._id + 'rejected'}
                  >
                    {statusUpdating === user._id + 'rejected' ? 'Rejecting...' : 'Reject'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No applicants yet.</p>
        )}
      </main>
    </div>
  );
};

export default Applicant;

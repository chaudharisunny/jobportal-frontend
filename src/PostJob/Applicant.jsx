import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import API from '../utils/api';

const Applicant = () => {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicants = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) return;

      try {
        const res = await API.get(`https://jobportal-backend-d315.onrender.com/job/${jobId}/applicant`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Debug log
        console.log('Applicants response:', res.data.applicants);

        const baseURL = 'https://jobportal-backend-d315.onrender.com';
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
                {/* <p className="text-gray-600 mb-1">📧 {user.email || 'No Email Provided'}</p> */}
                {user.phone && <p className="text-gray-600 mb-1">📱 {user.phone}</p>}
                {user.skills && (
                  <p className="text-gray-600 mb-1">
                    🛠 Skills:{' '}
                    {Array.isArray(user.skills)
                      ? user.skills.join(', ')
                      : user.skills}
                  </p>
                )}

                {/* Buttons */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {user.resumeUrl ? (
                    <>
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
                    </>
                  ) : (
                    <p className="text-sm text-gray-400 italic mt-2">No resume uploaded</p>
                  )}

                  {/* <Link
                    to={`/applicant/${user._id}`}
                    className="text-white bg-gray-700 hover:bg-gray-800 px-3 py-1 rounded text-sm"
                  >
                    View Profile
                  </Link> */}
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

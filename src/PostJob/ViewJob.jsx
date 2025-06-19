import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const ViewJob = () => {
  const [jobs, setJobs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      const token = sessionStorage.getItem('token'); // ✅ Use localStorage for consistency
      if (!token) return;

      try {
        const res = await axios.get('http://localhost:3000/myJob', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const jobList = res.data.data || [];
        setJobs(jobList);

        const notes = jobList.map((job) => `New applicant for ${job.title}`);
        setNotifications(notes);
      } catch (error) {
        console.error('Failed to fetch jobs:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">📋 Available Jobs</h1>

          {/* Job Cards */}
          {loading ? (
            <p className="text-center text-gray-500">Loading jobs...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.length > 0 ? (
                jobs.map((job) => (
                  <div
                    key={job._id}
                    className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition-shadow border border-gray-200 relative"
                  >
                    <h2 className="text-xl font-semibold text-gray-800 mb-1 break-words">
                      {job.title || 'Untitled'}
                    </h2>
                    <p className="text-sm text-gray-600 mb-1">
                      📍 {job.location || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-500 mb-3">
                      👥 Applicants: {job.applicantCount || 0}
                    </p>

                    <Link
                      to={`/applicant/${job._id}`}
                      className="inline-block text-sm text-blue-600 hover:underline"
                    >
                      View Applicants
                    </Link>

                    {job.applied && (
                      <span className="absolute top-3 right-3 bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                        ✅ Applied
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-600 col-span-full text-center py-10">
                  🚫 No jobs posted yet.
                </p>
              )}
            </div>
          )}

          {/* Notifications */}
          {notifications.length > 0 && (
            <div className="mt-10 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg shadow-sm w-full max-w-3xl mx-auto">
              <h2 className="text-lg font-semibold text-yellow-800 mb-2">🔔 Notifications</h2>
              <ul className="list-disc pl-6 text-sm text-yellow-700 space-y-1">
                {notifications.map((note, i) => (
                  <li key={i}>{note}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ViewJob;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Application() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3000/applications', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplications(res.data.applications || []);
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    };

    fetchApplications();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 space-y-4 hidden md:block">
        <h2 className="text-lg font-semibold mb-4 text-blue-600">Recruiter Dashboard</h2>
        <nav className="flex flex-col space-y-2">
          <Link to="/newpost" className="text-gray-700 hover:text-blue-600">📝 New Post</Link>
          <Link to="/available-jobs" className="text-gray-700 hover:text-blue-600">📄 Available Jobs</Link>
          <Link to="/update-post" className="text-gray-700 hover:text-blue-600">✏️ Update Post</Link>
          <Link to="/application" className="text-blue-700 font-semibold">📥 Applications</Link>
        </nav>
      </aside>

      {/* Applications Content */}
      <main className="flex-1 p-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-blue-700">Job Applications</h1>

          {applications.length === 0 ? (
            <p className="text-gray-600">No applications received yet.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
              {applications.map((app) => (
                <div key={app._id} className="bg-white p-5 rounded shadow space-y-2">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {app.candidateName || 'Unknown Candidate'}
                  </h2>
                  <p className="text-gray-700">
                    <strong>Email:</strong> {app.candidateEmail}
                  </p>
                  <p className="text-gray-700">
                    <strong>Applied for:</strong> {app.jobTitle}
                  </p>
                  <a
                    href={app.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View Resume
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Application;

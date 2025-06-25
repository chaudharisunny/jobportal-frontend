import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import API from '../utils/api';

const DashboardJob = () => {
  const [jobs, setJobs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [totalApplicants, setTotalApplicants] = useState(0);

  useEffect(() => {
    const fetchJobs = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) return;

      try {
        const res = await API.get('https://jobportal-backend-d315.onrender.com/myJob', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const jobList = res.data.data;
        setJobs(jobList);

        const total = jobList.reduce((sum, job) => sum + (job.applicantCount || 0), 0);
        setTotalApplicants(total);

        const notes = jobList.map((job) => `New applicant for ${job.title}`);
        setNotifications(notes);
      } catch (error) {
        console.error('Failed to fetch jobs:', error.response?.data || error.message);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <Sidebar />

      <main className="flex-1 bg-gray-50 p-4 sm:p-6 md:p-10">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-6">Recruiter Dashboard</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card title="Total Jobs" value={jobs.length} color="text-blue-600" />
          <Card title="Total Applicants" value={totalApplicants} color="text-purple-600" />
          <Card title="Applications" value={totalApplicants} color="text-green-600" />
          <Card title="Hired" value={0} color="text-red-600" />
        </div>

        {/* Job List */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Posted Jobs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white p-4 rounded-xl shadow border border-gray-200"
              >
                <h3 className="text-lg font-bold text-gray-700 mb-1">{job.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{job.category}</p>
                <p className="text-sm text-gray-500 mb-2">
                  Applicants: <span className="font-medium">{job.applicantCount || 0}</span>
                </p>
                <Link
                  to={`/job/${job._id}/applicants`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  View Applicants
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="mt-10 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg shadow-sm w-full">
          <h2 className="text-lg font-semibold text-yellow-800 mb-2">Notifications</h2>
          {notifications.length > 0 ? (
            <ul className="list-disc pl-5 text-sm text-yellow-700 space-y-1">
              {notifications.map((note, i) => (
                <li key={i}>{note}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-yellow-700">No new notifications.</p>
          )}
        </div>
      </main>
    </div>
  );
};

// Reusable Card Component
const Card = ({ title, value, color }) => (
  <div className="bg-white shadow rounded-xl p-5">
    <h2 className="text-base font-medium text-gray-700">{title}</h2>
    <p className={`text-3xl font-semibold ${color}`}>{value}</p>
  </div>
);

export default DashboardJob;

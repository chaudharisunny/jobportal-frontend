import React, { useEffect, useState } from 'react';
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
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Sidebar />

      <main className="flex-1 p-6 md:p-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Recruiter Dashboard</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <Card title="Total Jobs" value={jobs.length} color="text-blue-600" icon="🧰" />
          <Card title="Total Applicants" value={totalApplicants} color="text-purple-600" icon="👥" />
          <Card title="Applications" value={totalApplicants} color="text-green-600" icon="📄" />
        </div>

        {/* Notifications */}
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-yellow-900 mb-3">Notifications</h2>
          {notifications.length > 0 ? (
            <ul className="list-disc pl-5 text-sm text-yellow-800 space-y-2">
              {notifications.map((note, i) => (
                <li key={i}>{note}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-yellow-800">No new notifications.</p>
          )}
        </div>
      </main>
    </div>
  );
};

// Enhanced Card Component
const Card = ({ title, value, color, icon }) => (
  <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-6 flex items-center space-x-4">
    <div className="text-4xl">{icon}</div>
    <div>
      <h2 className="text-sm font-medium text-gray-500 mb-1">{title}</h2>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  </div>
);

export default DashboardJob;

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const JobDetailCard = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) return;

        const response = await axios.get('http://localhost:3000/myJob', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setJobs(response.data.data);
      } catch (error) {
        console.error('Error fetching my jobs:', error.response?.data || error.message);
      }
    };

    fetchMyJobs();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">My Posted Jobs</h2>
      {jobs.length > 0 ? (
        jobs.map((job) => (
          <div key={job._id} className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-xl font-semibold">{job.title}</h3>
            <p className="text-gray-600">Location: {job.location}</p>
            <p className="text-sm text-gray-500">Description: {job.description}</p>
            <p className="text-sm text-gray-500">
              Posted on: {new Date(job.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))
      ) : (
        <p>No jobs posted yet.</p>
      )}
    </div>
  );
};

export default JobDetailCard;

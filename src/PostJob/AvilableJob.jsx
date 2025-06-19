import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import JobDetailCard from '../JobDetailCard';

function AvilableJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);

  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const res = await axios.get('http://localhost:3000/myJob', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const jobs = res.data.data;
        const foundJob = jobs.find((j) => j._id === id);

        if (foundJob) {
          setJob(foundJob);
        } else {
          setJob(null);
        }
      } catch (err) {
        console.error('Failed to fetch jobs:', err);
      }
    };

    fetchMyJobs();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 space-y-4">
      <button
        onClick={() => navigate('/dashboard')}
        className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
      >
        ← Back to Dashboard
      </button>

      {job ? (
        <JobDetailCard job={job} />
      ) : (
        <p className="text-red-500 text-sm">Job not found or not posted by you.</p>
      )}
    </div>
  );
}

export default AvilableJob;

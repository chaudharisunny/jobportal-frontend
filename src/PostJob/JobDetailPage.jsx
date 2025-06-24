import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../utils/api';

function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);

  useEffect(() => {
    API
      .get(`https://jobportal-backend-d315.onrender.com/alljob/${id}`)
      .then((res) => setJob(res.data.data))
      .catch((err) => console.error('Error fetching job:', err));
  }, [id]);

  if (!job) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-blue-600 hover:text-blue-800 font-medium flex items-center"
      >
        ← Back
      </button>

      {/* Job Info Box */}
      <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
        <h2 className="text-3xl font-bold text-blue-700 mb-4">{job.title}</h2>
        <p className="text-gray-700 mb-2"><span className="font-semibold">Company:</span> {job.company}</p>
        <p className="text-gray-700 mb-2"><span className="font-semibold">Location:</span> {job.location}</p>
        <p className="text-gray-700 mb-2"><span className="font-semibold">Salary:</span> {job.salaryRange}</p>
        <p className="text-gray-700 mb-2"><span className="font-semibold">Skill Required:</span> {job.skill}</p>
        <p className="text-gray-800 mt-4 leading-relaxed">{job.description}</p>

        {/* Apply Button */}
        <button
          onClick={() => navigate(`/applyjob/${job._id}`)}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold transition"
        >
          Apply Now
        </button>
      </div>
    </div>
  );
}

export default JobDetailPage;

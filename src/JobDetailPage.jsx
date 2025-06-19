import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import jobs from './jobData'; // Extract your job data into a separate file

function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const job = jobs.find(job => job.id === parseInt(id));

  if (!job) return <p className="p-4 text-red-500">Job not found</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 text-sm bg-gray-300 rounded hover:bg-gray-400"
      >
        ← Back
      </button>
      <div className="bg-white p-4 rounded-xl shadow-md space-y-2">
        <h2 className="text-lg font-semibold">{job.title}</h2>
        <p className="text-sm text-gray-600">{job.company}</p>
        <p className="text-sm text-gray-500">{job.location}</p>
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
          {job.description.map((point, i) => <li key={i}>{point}</li>)}
        </ul>
        <button className="mt-2 px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700">
          Apply Now
        </button>
      </div>
    </div>
  );
}

export default JobDetailPage;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function JobCard({ job, onClick }) {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleClick = () => {
    if (isMobile) {
      navigate(`/job/${job._id}`);
    } else {
      onClick(); // for detail preview on desktop
    }
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white p-3 rounded-xl shadow-md hover:bg-blue-50 transition cursor-pointer space-y-2"
    >
      <h2 className="text-sm font-semibold text-gray-800">{job.title}</h2>
      <p className="text-xs text-gray-600">{job.company}</p>
      <p className="text-xs text-gray-500">{job.location}</p>
      <p className="text-xs text-gray-500">{job.salary} • {job.category}</p>
      <ul className="list-disc list-inside text-xs text-gray-700 space-y-1">
        {job.description.slice(0, 2).map((point, idx) => (
          <li key={idx}>{point}</li>
        ))}
      </ul>
      <button className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
        View Details
      </button>
    </div>
  );
}

export default JobCard;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import JobDetailCard from './JobDetailCard';
import API from './utils/api';

function ApplyJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [resume, setResume] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/applyjob/${id}`);
        setJob(res.data.data);
      } catch (err) {
        console.error('Failed to fetch job:', err);
        setMessage('Failed to load job details.');
      }
    };
    fetchJob();
  }, [id]);

  const handleResumeChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleApply = async () => {
    if (!resume) {
      setMessage('Please upload your resume.');
      return;
    }

    const token = sessionStorage.getItem('token');
    if (!token) {
      console.error('No token found in localStorage');
      setMessage('You must be logged in to apply for jobs.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', resume);

    try {
      setLoading(true);
      const response = await API.post(
        `https://jobportal-backend-d315.onrender.com/applyjob/${id}`,
        
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
        
      );
      
      setMessage(response.data.message || 'Applied successfully!');
      setHasApplied(true);

      setTimeout(() => {
        navigate('/home'); // redirect to home
      }, 1500);
    } catch (err) {
      console.error('Resume upload failed:', err);
      setMessage('Resume upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 pt-10 max-w-5xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Apply for Job</h1>

      {job ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Resume Upload Section */}
          <div className="bg-white p-4 rounded-xl shadow space-y-4">
            <h2 className="text-lg font-semibold">Upload Your Resume</h2>

            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeChange}
              className="block w-full text-sm"
            />

            {resume && (
              <p className="text-sm text-green-600">Selected: {resume.name}</p>
            )}

            <button
              onClick={handleApply}
              disabled={loading || hasApplied}
              className={`px-4 py-2 text-sm rounded text-white ${
                loading || hasApplied
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Applying...' : hasApplied ? 'Already Applied' : 'Submit Application'}
            </button>

            {message && <p className="text-sm text-gray-700">{message}</p>}
          </div>

          {/* Job Details Section */}
          <div>
            <JobDetailCard job={job} />
            {hasApplied && (
              <div className="mt-2 px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full inline-block">
                Applied
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-600">Loading job details...</p>
      )}
    </div>
  );
}

export default ApplyJob;

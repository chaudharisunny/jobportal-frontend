import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const UpdateJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [jobData, setJobData] = useState({
    title: '',
    location: '',
    category: 'Full-Time',
    description: '',
    salaryRange: '',
    skill: '',
    deadline: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const res = await axios.get('http://localhost:3000/myJob', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const foundJob = res.data.data.find((job) => job._id === id);
        if (!foundJob) {
          setError('❌ Job not found.');
        } else {
          setJobData({
            title: foundJob.title || '',
            location: foundJob.location || '',
            category: foundJob.category || 'Full-Time',
            description: Array.isArray(foundJob.description) ? foundJob.description.join('. ') : foundJob.description || '',
            salaryRange: foundJob.salaryRange || '',
            skill: Array.isArray(foundJob.skill) ? foundJob.skill.join(', ') : foundJob.skill || '',
            deadline: foundJob.deadline ? foundJob.deadline.split('T')[0] : '',
          });
        }
      } catch (err) {
        console.error(err);
        setError('🚨 Error fetching job data.');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedPayload = {
      ...jobData,
      skill: jobData.skill.split(',').map((s) => s.trim()),
      description: jobData.description.split('.').map((d) => d.trim()).filter(Boolean),
    };

    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3000/editjob/${id}`, updatedPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('✅ Job updated successfully!');
      navigate('/updatepost');
    } catch (err) {
      console.error(err);
      alert('❌ Failed to update job.');
    }
  };

  if (loading) return <p className="text-center mt-10">⏳ Loading job data...</p>;

  if (error)
    return (
      <div className="text-center mt-10 text-red-500">
        <p>{error}</p>
        <Link to="/updatepost" className="text-blue-600 underline mt-2 inline-block">
          ⬅ Go Back
        </Link>
      </div>
    );

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">🛠 Update Job</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          name="title"
          value={jobData.title}
          onChange={handleChange}
          placeholder="Job Title"
          className="w-full border px-4 py-2 rounded focus:ring focus:border-blue-400"
          required
        />

        <input
          name="location"
          value={jobData.location}
          onChange={handleChange}
          placeholder="Location"
          className="w-full border px-4 py-2 rounded focus:ring focus:border-blue-400"
          required
        />

        <input
          name="salaryRange"
          value={jobData.salaryRange}
          onChange={handleChange}
          placeholder="Salary (e.g. ₹60,000 - ₹90,000)"
          className="w-full border px-4 py-2 rounded focus:ring focus:border-blue-400"
          required
        />

        <select
          name="category"
          value={jobData.category}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded focus:ring focus:border-blue-400"
          required
        >
          <option value="Full-Time">Full-Time</option>
          <option value="Part-Time">Part-Time</option>
          <option value="Remote">Remote</option>
          <option value="Internship">Internship</option>
          <option value="Contract">Contract</option>
        </select>

        <input
          type="date"
          name="deadline"
          value={jobData.deadline}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded focus:ring focus:border-blue-400"
          required
        />

        <textarea
          name="description"
          value={jobData.description}
          onChange={handleChange}
          placeholder="Job Description (use periods to separate)"
          rows={4}
          className="w-full border px-4 py-2 rounded focus:ring focus:border-blue-400"
          required
        ></textarea>

        <textarea
          name="skill"
          value={jobData.skill}
          onChange={handleChange}
          placeholder="Skills (comma-separated)"
          rows={3}
          className="w-full border px-4 py-2 rounded focus:ring focus:border-blue-400"
          required
        ></textarea>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          🔄 Update Job
        </button>
      </form>
    </div>
  );
};

export default UpdateJob;

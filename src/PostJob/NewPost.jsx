import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

function NewPost() {
  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    category: '',
    salaryRange: '',
    skill: '',
    description: '',
    deadline: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You are not logged in. Please login first.');
      return;
    }

    try {
      await axios.post(
        'http://localhost:3000/newApplication',
        {
          ...form,
          skill: form.skill.split(',').map((s) => s.trim()),
          description: form.description.split('.').map((d) => d.trim()).filter(Boolean),
          deadline: form.deadline
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert('Job created successfully!');
      setForm({
        title: '',
        company: '',
        location: '',
        category: '',
        salaryRange: '',
        skill: '',
        description: '',
        deadline: ''
      });
    } catch (error) {
      console.error('Error creating job:', error.response?.data || error.message);
      alert('Failed to create job. ' + (error.response?.data?.message || 'Please try again.'));
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 font-sans">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-md">
          <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800">📝 Post a New Job</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['title', 'company', 'location', 'salaryRange'].map((field) => (
                <input
                  key={field}
                  name={field}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={form[field]}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded text-sm sm:text-base"
                  required
                />
              ))}

              <select
                name="category"
                onChange={handleChange}
                value={form.category}
                className="w-full px-4 py-2 border border-gray-300 rounded text-sm sm:text-base"
                required
              >
                <option value="">Select Job Type</option>
                <option value="full-time">Full-Time</option>
                <option value="part-time">Part-Time</option>
                <option value="remote">Remote</option>
              </select>

              <input
                type="date"
                name="deadline"
                value={form.deadline}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded text-sm sm:text-base"
                required
              />
            </div>

            <textarea
              name="skill"
              placeholder="Required skills (comma separated)"
              value={form.skill}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded text-sm sm:text-base"
              required
            />
            <textarea
              name="description"
              placeholder="Job description (separate by period)"
              value={form.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded text-sm sm:text-base"
              required
            />

            <button
              type="submit"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition duration-200"
            >
              ✅ Post Job
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default NewPost;

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
    deadline: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem('token');
    if (!token) {
      alert('You are not logged in. Please login first.');
      return;
    }

    try {
      await axios.post(
        'https://jobportal-backend-d315.onrender.com/newApplication',
        {
          ...form,
          skill: form.skill.split(',').map((s) => s.trim()),
          description: form.description.split('.').map((d) => d.trim()).filter(Boolean),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert('✅ Job created successfully!');
      setForm({
        title: '',
        company: '',
        location: '',
        category: '',
        salaryRange: '',
        skill: '',
        description: '',
        deadline: '',
      });
    } catch (error) {
      console.error('Error creating job:', error.response?.data || error.message);
      alert('❌ Failed to create job. ' + (error.response?.data?.message || 'Please try again.'));
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Sidebar />

      <main className="flex-1 px-4 sm:px-8 md:px-12 py-8">
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            📝 Post a New Job
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormInput label="Job Title" name="title" value={form.title} onChange={handleChange} />
              <FormInput label="Company Name" name="company" value={form.company} onChange={handleChange} />
              <FormInput label="Location" name="location" value={form.location} onChange={handleChange} />
              <FormInput label="Salary Range" name="salaryRange" value={form.salaryRange} onChange={handleChange} />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
                  required
                >
                  <option value="">Select</option>
                  <option value="full-time">Full-Time</option>
                  <option value="part-time">Part-Time</option>
                  <option value="remote">Remote</option>
                </select>
              </div>
              <FormInput label="Application Deadline" name="deadline" value={form.deadline} onChange={handleChange} type="date" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Required Skills</label>
              <textarea
                name="skill"
                placeholder="e.g. React, Node.js, MongoDB"
                value={form.skill}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
              <textarea
                name="description"
                placeholder="Write job responsibilities separated by periods."
                value={form.description}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md shadow transition-all duration-200"
            >
              ✅ Post Job
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

const FormInput = ({ label, name, value, onChange, type = 'text' }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
      required
    />
  </div>
);

export default NewPost;

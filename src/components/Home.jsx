import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';

function JobCard({ job, onClick }) {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleClick = () => {
    if (isMobile) {
      navigate(`/job/${job._id}`);
    } else {
      onClick();
    }
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white p-4 rounded-2xl shadow-md hover:bg-blue-50 transition cursor-pointer space-y-2 border border-gray-100"
    >
      <h2 className="text-base font-semibold text-gray-900">{job.title}</h2>
      <p className="text-sm text-gray-700">{job.company}</p>
      <p className="text-sm text-gray-600">{job.location}</p>
      <p className="text-sm text-gray-500">{job.salaryRange} • {job.category}</p>
      {Array.isArray(job.description) && job.description.slice(0, 2).map((point, idx) => (
        <li key={idx} className="text-xs text-gray-600">{point}</li>
      ))}
      <button className="mt-2 px-3 py-1 text-xs bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
        View Details
      </button>
    </div>
  );
}

function JobDetailCard({ job }) {
  const descriptionList = Array.isArray(job.description)
    ? job.description
    : job.description?.split() || [];
  const navigate = useNavigate();

  return (
    <div className="bg-white p-5 rounded-2xl shadow-md space-y-4 border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-900">{job.title}</h2>
      <p className="text-sm text-gray-700">{job.company}</p>
      <p className="text-sm text-gray-600">{job.location}</p>
      <p className="text-sm text-gray-500">{job.salaryRange} • {job.category}</p>

      <button
        className="mt-3 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        onClick={() => navigate(`/applyjob/${job._id}`)}
      >
        Apply Now
      </button>

      <div className="pt-4 space-y-4 border-t">
        <div>
          <h4 className="text-sm font-medium text-gray-600">Pay</h4>
          <p className="text-sm text-gray-800">{job.salaryRange}</p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-600">Job Type</h4>
          <p className="text-sm text-gray-800 capitalize">{job.category}</p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-600">Skills</h4>
          <p className="text-sm text-gray-800">
            {Array.isArray(job.skill) ? job.skill.join(', ') : job.skill}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-600">Responsibilities</h4>
          <ul className="list-disc list-inside text-xs text-gray-700 space-y-1">
            {descriptionList?.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-600">Location</h4>
          <p className="text-sm text-gray-800">{job.location}</p>
        </div>
      </div>
    </div>
  );
}

function Home() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    salary: '',
    type: '',
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await API.get('https://jobportal-backend-d315.onrender.com/alljob');
        setJobs(res.data.data || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load jobs.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      filters.search === '' ||
      job.title.toLowerCase().includes(filters.search.toLowerCase());

    const matchesSalary =
      filters.salary === '' ||
      (filters.salary === '5-10' && job.salaryRange.includes('5')) ||
      (filters.salary === '10-20' && job.salaryRange.includes('10')) ||
      (filters.salary === '20+' && job.salaryRange.includes('20'));

    const matchesType =
      filters.type === '' || job.category?.toLowerCase() === filters.type;

    return matchesSearch && matchesSalary && matchesType;
  });

  return (
    <div className="min-h-screen bg-gray-100 px-4 pt-10 pb-10">
      <form className="w-full max-w-6xl mx-auto flex flex-col sm:flex-row gap-2 mb-6" onSubmit={(e) => e.preventDefault()}>
        <input
          type="search"
          placeholder="Search job roles"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="flex-1 px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
        />
        <button
          type="submit"
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Find Job
        </button>
      </form>

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/4 bg-white p-5 rounded-2xl shadow space-y-5 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Filter Jobs</h3>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Salary</label>
            <select
              value={filters.salary}
              onChange={(e) => setFilters({ ...filters, salary: e.target.value })}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select</option>
              <option value="5-10">₹5–10 LPA</option>
              <option value="10-20">₹10–20 LPA</option>
              <option value="20+">₹20+ LPA</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Job Type</label>
            <div className="space-y-2 text-sm text-gray-700">
              {['full-time', 'part-time', 'remote'].map((type) => (
                <label key={type} className="flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value={type}
                    checked={filters.type === type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                    className="mr-2"
                  />
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={() => setFilters({ search: '', salary: '', type: '' })}
            className="text-sm text-blue-600 hover:underline"
          >
            Clear Filters
          </button>
        </div>

        <div className="w-full lg:w-3/4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-3 h-[80vh] overflow-y-auto pr-2">
            {loading ? (
              <p className="text-gray-500 text-sm">Loading jobs...</p>
            ) : error ? (
              <p className="text-red-500 text-sm">{error}</p>
            ) : filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <JobCard key={job._id} job={job} onClick={() => setSelectedJob(job)} />
              ))
            ) : (
              <p className="text-gray-500 text-sm">No jobs found.</p>
            )}
          </div>

          <div className="hidden lg:block h-[80vh] overflow-y-auto pr-2">
            {selectedJob ? (
              <JobDetailCard job={selectedJob} />
            ) : (
              <div className="text-sm text-gray-500 p-4">Select a job to view details</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

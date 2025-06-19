import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { path: '/dashboardJob', label: '🏠 Dashboard' },
    { path: '/newpost', label: '📝 Post Job' },
    { path: '/viewjob', label: '📄 View Jobs' },
    { path: '/updatepost', label: '✏️ Update Job' },
  ];

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between bg-gray-800 text-white px-4 py-3 shadow">
        <h2 className="text-xl font-bold">Recruiter</h2>
        <button onClick={() => setIsOpen(!isOpen)}>
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar for large screens or mobile drawer */}
      <aside
        className={`bg-gray-800 text-white w-60 p-5 space-y-4 min-h-screen absolute md:relative z-50 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <h2 className="text-2xl font-bold mb-6 hidden md:block">Recruiter</h2>

        <nav className="space-y-3">
          {navLinks.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setIsOpen(false)}
              className={`block ${
                location.pathname === path
                  ? 'text-yellow-300 font-semibold'
                  : 'text-white hover:text-yellow-300'
              }`}
            >
              {label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="mt-6 text-red-400 hover:text-red-600"
          >
            🚪 Logout
          </button>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;

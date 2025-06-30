import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, LogOut } from 'lucide-react';

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { path: '/dashboardJob', label: 'Dashboard', icon: '🏠' },
    { path: '/newpost', label: 'Post Job', icon: '📝' },
    { path: '/viewjob', label: 'View Jobs', icon: '📄' },
    { path: '/updatepost', label: 'Update Job', icon: '✏️' },
  ];

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between bg-gray-800 text-white px-4 py-3 shadow">
        <h2 className="text-xl font-bold">Recruiter</h2>
        <button onClick={() => setIsOpen(!isOpen)}>
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`bg-gray-900 text-white w-60 h-screen fixed top-0 left-0 z-50 p-5 space-y-6 transition-transform duration-300 ease-in-out transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static md:block`}
      >
        {/* Logo */}
        <div className="hidden md:block text-2xl font-bold text-yellow-400 tracking-wide">
          Recruiter Panel
        </div>

        {/* Navigation */}
        <nav className="flex flex-col space-y-2">
          {navLinks.map(({ path, label, icon }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition duration-200 ${
                location.pathname === path
                  ? 'bg-yellow-300 text-gray-900 font-semibold'
                  : 'hover:bg-gray-700 hover:text-yellow-300'
              }`}
            >
              <span className="text-xl">{icon}</span>
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 text-red-400 hover:text-red-600 mt-10 transition duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </aside>
    </>
  );
}

export default Sidebar;

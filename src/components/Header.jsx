import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Header() {
  const [userInitial, setUserInitial] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      const user = parseJwt(token);
      const name = user?.fullName || user?.username || user?.email;
      if (name) {
        setUserInitial(name.charAt(0).toUpperCase());
        setIsLoggedIn(true);
      } else {
        setUserInitial('');
        setIsLoggedIn(false);
      }
    } else {
      setUserInitial('');
      setIsLoggedIn(false);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUserInitial('');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-white shadow-md sticky top-0 z-50">
      {/* Brand */}
      <h1
        onClick={() => navigate('/home')}
        className="text-3xl font-bold cursor-pointer tracking-wide transition duration-200 hover:scale-105"
      >
        <span className="text-blue-700">Quick</span>
        <span className="text-gray-900">Hire</span>
      </h1>

      {/* Right-side buttons */}
      <div className="flex items-center space-x-4">
        {isLoggedIn && (
          <button
            onClick={() => navigate('/dashboardjob')}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition text-sm"
          >
            Post Job
          </button>
        )}

        {userInitial ? (
          <div className="relative">
            <button
              onClick={() => setShowDropdown((prev) => !prev)}
              className="w-10 h-10 rounded-full bg-blue-600 text-white font-semibold flex items-center justify-center shadow hover:scale-105 transition"
              title="User Menu"
            >
              {userInitial}
            </button>

            {showDropdown && (
              <ul className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden animate-fadeIn z-50">
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => {
                    navigate('/profile');
                    setShowDropdown(false);
                  }}
                >
                  Profile
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => {
                    navigate('/saved-jobs');
                    setShowDropdown(false);
                  }}
                >
                  Saved Jobs
                </li>
                <li
                  className="px-4 py-2 hover:bg-red-100 text-red-600 cursor-pointer text-sm"
                  onClick={handleLogout}
                >
                  Logout
                </li>
              </ul>
            )}
          </div>
        ) : (
          <>
            <button
              onClick={() => navigate('/login')}
              className="text-blue-600 hover:underline text-sm"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition text-sm"
            >
              Signup
            </button>
          </>
        )}
      </div>
    </header>
  );
}

// Helper function to decode JWT
function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

export default Header;

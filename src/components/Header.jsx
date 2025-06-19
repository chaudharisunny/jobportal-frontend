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
    <header className="flex justify-between items-center p-4 bg-white shadow">
      <h1
        className="text-xl font-bold cursor-pointer text-blue-600"
        onClick={() => navigate('/home')}
      >
        QuickHire
      </h1>

      <div className="flex items-center gap-4">
        {isLoggedIn && (
          <button
            onClick={() => navigate('/dashboardjob')}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Post Job
          </button>
        )}

        {userInitial ? (
          <div className="relative">
            <button
              onClick={() => setShowDropdown((prev) => !prev)}
              className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center"
              title="User menu"
            >
              {userInitial}
            </button>

            {showDropdown && (
              <ul className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10">
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    navigate('/profile');
                    setShowDropdown(false);
                  }}
                >
                  Profile
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    navigate('/saved-jobs');
                    setShowDropdown(false);
                  }}
                >
                  Saved Jobs
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600"
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
              className="text-blue-600 hover:underline"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="bg-blue-600 text-white px-4 py-1 rounded"
            >
              Signup
            </button>
          </>
        )}
      </div>
    </header>
  );
}

// Helper to decode JWT
function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

export default Header;

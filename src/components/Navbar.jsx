import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // Set default theme on mount and when theme changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Theme toggle handler
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = () => {
    setShowLogoutModal(false);
    logout();
  };

  return (
    <div className="navbar bg-primary text-primary-content shadow-lg px-6 min-h-16 flex flex-row items-center justify-between">
      <div className="flex-1">
        <Link to={user ? "/dashboard" : "/"} className="btn btn-ghost normal-case text-xl text-primary-content">
          JobBoard <span className="ml-2">💼</span>
        </Link>
      </div>
      <div className="flex-none flex flex-row items-center gap-2">
        {/* DaisyUI theme toggle */}
        <button className="btn btn-ghost btn-circle swap swap-rotate text-primary-content" onClick={toggleTheme} aria-label="Toggle dark mode">
          <input type="checkbox" checked={theme === 'dark'} readOnly />
          {/* sun icon */}
          <svg className="swap-off fill-current w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.64 17.657l-1.414 1.414-1.414-1.414 1.414-1.414zm12.02 0l1.414 1.414-1.414 1.414-1.414-1.414zM12 4V1h0v3zm0 19v-3h0v3zm8-8h3v0h-3zm-19 0h3v0H1zm15.364-7.657l1.414-1.414 1.414 1.414-1.414 1.414zM6.343 6.343L4.93 4.93l1.414-1.414 1.414 1.414zM12 7a5 5 0 100 10 5 5 0 000-10z"/></svg>
          {/* moon icon */}
          <svg className="swap-on fill-current w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.752 15.002A9.718 9.718 0 0112 22C6.477 22 2 17.523 2 12c0-4-418 2.865-8.166 6.839-9.489a1 1 0 01.986 1.675A7 7 0 0019 12c0 1.306-.417 2.515-1.124 3.502a1 1 0 01.876 1.5z"/></svg>
        </button>
        {/* End theme toggle */}
        {user ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full bg-accent text-accent-content flex items-center justify-center font-bold text-lg">
                {user.name && user.name[0] ? user.name[0].toUpperCase() : null}
              </div>
            </label>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow-lg menu menu-sm dropdown-content bg-base-100 text-base-content rounded-box w-52 border border-neutral">
              <li className="menu-title">
                <span>Hi, {user.name}</span>
              </li>
              {user.role === "user" && (
                <li>
                  <Link to="/my-applications">My Applications</Link>
                </li>
              )}
              <li>
                <button onClick={() => setShowLogoutModal(true)} className="text-error">Logout</button>
              </li>
            </ul>
            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
              <div className="modal modal-open">
                <div className="modal-box">
                  <h3 className="font-bold text-lg">Confirm Logout</h3>
                  <p className="py-4">Are you sure you want to logout?</p>
                  <div className="modal-action">
                    <button className="btn" onClick={() => setShowLogoutModal(false)}>Cancel</button>
                    <button className="btn btn-error" onClick={handleLogout}>Logout</button>
                  </div>
                </div>
                <div className="modal-backdrop" onClick={() => setShowLogoutModal(false)}></div>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login" className="btn btn-primary btn-sm">
              Login
            </Link>
            <Link to="/register" className="btn btn-outline btn-primary btn-sm">
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

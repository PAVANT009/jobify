"use client";

import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuth();


  return (
    <nav className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <a href="/" className="text-xl font-bold hover:opacity-90">
          Jobify
        </a>

        <div className="flex items-center gap-4">


          {user ? (
            <>
              <ul className="flex items-center gap-4">
                {user.role === "user" && (
                  <li>
                    <Link to="/my-applications">My Applications</Link>
                  </li>
                )}
              </ul>
              <div className="flex items-center gap-2">
                <div className="avatar">
                  <div className="w-8 rounded-full ring  ring-offset-base-100 ring-offset-2">
                    <img
                      className="rounded-full"
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                      alt={user.name}
                    />
                  </div>
                </div>
                <span className="hidden sm:inline font-medium">{user.name}</span>
              </div>
              <button
                onClick={logout}
                className="group relative px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
              >
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="font-medium">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="btn btn-sm bg-white text-indigo-600 hover:bg-gray-100 border-none"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="btn btn-sm bg-white text-indigo-600 hover:bg-gray-100 border-none"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

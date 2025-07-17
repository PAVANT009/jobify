import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <Link to={user ? "/dashboard" : "/"} className="text-xl font-bold text-black">
        JobBoard 💼
      </Link>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-gray-600">Hi, {user.name}</span>
            {user.role === "user" && (
              <Link to="/my-applications" className="text-blue-600 hover:underline">
                My Applications
              </Link>
            )}
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
            <Link to="/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

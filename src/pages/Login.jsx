import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../context/ToastContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      showToast("Login successful!", "success");
      navigate("/dashboard");
    } catch {
      setError("Invalid login credentials");
      showToast("Invalid login credentials", "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 to-indigo-100">
      <div className="card w-full max-w-md bg-white shadow-2xl rounded-2xl border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="card-body p-0">
          <h2 className="text-3xl font-bold text-center text-indigo-600 mb-1">Welcome Back!</h2>
          <p className="text-sm text-center text-gray-500 mb-4">Login to access job listings and apply instantly</p>
          {error && <p className="text-error text-sm text-center mb-3">{error}</p>}

          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text text-gray-700 font-medium">Email</span>
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border-2 border-indigo-200 focus:border-indigo-500 focus:outline-none rounded-xl bg-gray-50 text-gray-800 placeholder-gray-400 shadow-sm"
              placeholder="Enter your email"
              required
              autoComplete="email"
              aria-label="Email"
            />
          </div>

          <div className="form-control mb-6">
            <label className="label">
              <span className="label-text text-gray-700 font-medium">Password</span>
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border-2 border-indigo-200 focus:border-indigo-500 focus:outline-none rounded-xl bg-gray-50 text-gray-800 placeholder-gray-400 shadow-sm"
              placeholder="Enter your password"
              required
              autoComplete="current-password"
              aria-label="Password"
            />
          </div>

          <div className="form-control mb-4">
            <button type="submit" className="btn btn-sm bg-white text-indigo-600 hover:bg-gray-100 border-none w-full rounded-full py-2 font-semibold text-lg shadow-md transition duration-200">Login</button>
          </div>

          <div className="text-center">
            <Link to="/register" className="text-sm text-indigo-600 hover:underline">Don't have an account? Register</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

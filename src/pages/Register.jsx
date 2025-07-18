// Improved Register Page UI with vibrant color scheme and styled input elements
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../context/ToastContext";

const INTEREST_OPTIONS = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Mobile Developer",
  "DevOps Engineer",
  "Data Scientist",
  "Machine Learning Engineer",
  "QA Engineer",
  "UI/UX Designer",
  "Product Manager",
  "Project Manager",
  "Business Analyst",
  "System Administrator",
  "Database Administrator",
  "Security Engineer",
  "Cloud Engineer",
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    interests: [],
  });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleInterestChange = (interest) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form.name, form.email, form.password, form.role, form.interests);
      showToast("Registration successful!", "success");
      navigate("/dashboard");
    } catch {
      setError("Registration failed. Please try again.");
      showToast("Registration failed", "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 via-purple-100 to-pink-100">
      <div className="card w-full max-w-md bg-white shadow-2xl rounded-2xl border border-gray-200 p-8">
        <form onSubmit={handleSubmit} className="card-body p-0">
          <h2 className="text-4xl font-extrabold text-center text-indigo-700 mb-2">Join Us Today!</h2>
          <p className="text-sm text-center text-gray-600 mb-5">Create your account to explore new job opportunities</p>
          {error && <p className="text-red-600 text-sm text-center mb-3 font-medium">{error}</p>}

          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text text-gray-800 font-semibold">Name</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-5 py-3 border border-indigo-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 focus:outline-none rounded-xl bg-white text-gray-900 placeholder-gray-400 shadow-sm transition duration-200"
              placeholder="Your name"
              required
            />
          </div>

          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text text-gray-800 font-semibold">Email</span>
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-5 py-3 border border-indigo-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 focus:outline-none rounded-xl bg-white text-gray-900 placeholder-gray-400 shadow-sm transition duration-200"
              placeholder="Your email"
              required
            />
          </div>

          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text text-gray-800 font-semibold">Password</span>
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-5 py-3 border border-indigo-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 focus:outline-none rounded-xl bg-white text-gray-900 placeholder-gray-400 shadow-sm transition duration-200"
              placeholder="Create a password"
              required
            />
          </div>

          <div className="form-control mb-6">
            <label className="label">
              <span className="label-text text-gray-800 font-semibold">Role</span>
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-5 py-3 border border-indigo-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 focus:outline-none rounded-xl bg-white text-gray-900 shadow-sm transition duration-200">
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Interest selection for users only */}
          {form.role === "user" && (
            <div className="form-control mb-6">
              <label className="label">
                <span className="label-text text-gray-800 font-semibold">Select Your Interests</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {INTEREST_OPTIONS.map((interest) => (
                  <label key={interest} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.interests.includes(interest)}
                      onChange={() => handleInterestChange(interest)}
                      className="checkbox checkbox-primary"
                    />
                    <span>{interest}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="form-control mb-4">
            <button type="submit" className="btn bg-indigo-600 hover:bg-indigo-700 text-white w-full rounded-full py-2 font-semibold text-lg shadow-md transition duration-200">Register</button>
          </div>

          <div className="text-center">
            <Link to="/login" className="text-sm text-indigo-600 hover:underline">Already have an account? Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

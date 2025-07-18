// Dashboard.jsx

import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";

const API = "https://jobify-c04l.onrender.com/api";
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

export default function Dashboard() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    category: "Frontend Developer",
    interests: [],
  });
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobModal, setShowJobModal] = useState(false);
  // Interest selection modal state
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState([]);

  useEffect(() => {
    if (!user) navigate("/login");
    // Show interest modal if user is regular user and has no interests
    if (user && user.role === "user" && (!user.interests || user.interests.length === 0)) {
      setShowInterestModal(true);
    }
  }, [user]);

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${API}/job/all`);
      setJobs(res.data);
    } catch {
      showToast("Failed to load jobs", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Handler for job interests selection (admin)
  const handleJobInterestChange = (interest) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const postJob = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/job/create`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm({
        title: "",
        company: "",
        location: "",
        description: "",
        category: "Frontend Developer",
        interests: [],
      });
      showToast("Job posted successfully!", "success");
      fetchJobs();
    } catch {
      showToast("Failed to post job", "error");
    }
  };

  const applyToJob = async (id) => {
    try {
      await axios.post(`${API}/job/apply/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast("Applied successfully!", "success");
      fetchJobs();
    } catch {
      showToast("Failed to apply to job", "error");
    }
  };

  // Handler for interest selection
  const handleInterestChange = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };
  // Handler for submitting interests
  const handleSubmitInterests = async () => {
    try {
      await axios.put(
        `${API}/user/interests`,
        { interests: selectedInterests },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast("Interests saved!", "success");
      // Update user context (fetch profile again)
      window.location.reload(); // simplest way to refresh user/interests
    } catch {
      showToast("Failed to save interests", "error");
    }
  };

  if (!user) return null;

  return (
    <div className="bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 min-h-screen p-6">
      {/* Interest Selection Modal */}
      {showInterestModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-lg">
            <h3 className="text-xl font-bold mb-4 text-indigo-800">Select Your Interests</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
              {INTEREST_OPTIONS.map((interest) => (
                <label key={interest} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedInterests.includes(interest)}
                    onChange={() => handleInterestChange(interest)}
                    className="checkbox checkbox-primary"
                  />
                  <span>{interest}</span>
                </label>
              ))}
            </div>
            <button
              className="btn btn-primary w-full mt-2"
              disabled={selectedInterests.length === 0}
              onClick={handleSubmitInterests}
            >
              Save Interests
            </button>
          </div>
          <div className="modal-backdrop" />
        </div>
      )}
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-indigo-800">
            Welcome, {user.name} 👋
          </h2>
        </div>

        {user.role === "admin" && (
          <form
            onSubmit={postJob}
            className="bg-white shadow-lg rounded-xl p-6 grid md:grid-cols-2 gap-4 border border-indigo-200"
          >
            <h3 className="text-xl font-semibold col-span-full text-indigo-700">
              Post a Job
            </h3>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Job Title"
              className="input input-bordered"
            />
            <input
              name="company"
              value={form.company}
              onChange={handleChange}
              placeholder="Company"
              className="input input-bordered"
            />
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Location"
              className="input input-bordered"
            />
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="select select-bordered bg-white text-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded-md p-2"
            >
              {INTEREST_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {/* Interests selection for job */}
            <div className="md:col-span-2">
              <label className="font-semibold text-indigo-700 mb-2 block">Relevant Interests (for notifications):</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {INTEREST_OPTIONS.map((interest) => (
                  <label key={interest} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.interests.includes(interest)}
                      onChange={() => handleJobInterestChange(interest)}
                      className="checkbox checkbox-primary"
                    />
                    <span>{interest}</span>
                  </label>
                ))}
              </div>
            </div>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Job Description"
              className="textarea textarea-bordered md:col-span-2"
            />
            <button
              type="submit"
              className="btn btn-primary md:col-span-2"
            >
              Post Job
            </button>
          </form>
        )}

        {user.role === "user" && (
          <div>
            <label className="font-semibold text-indigo-700 mr-2">
              Filter by Category:
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="select select-bordered bg-white text-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded-md p-2"
            >
              <option value="All">All</option>
              {[
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
              ].map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg text-indigo-600"></span>
          </div>
        ) : (
          <div className="grid gap-6">
            {jobs
              .filter((job) => categoryFilter === "All" || job.category === categoryFilter)
              .map((job) => (
                <div
                  key={job._id}
                  className="bg-white p-5 rounded-xl shadow border border-indigo-100 hover:shadow-lg transition cursor-pointer"
                  onClick={() => {
                    setSelectedJob(job);
                    setShowJobModal(true);
                  }}
                >
                  <div className="flex flex-col gap-1">
                    <h4 className="text-xl font-semibold text-indigo-800">{job.title}</h4>
                    <p className="text-sm text-gray-700">{job.company} — {job.location}</p>
                    <span className="badge badge-outline badge-info w-fit mt-1">{job.category}</span>
                    <p className="mt-2 text-gray-600 line-clamp-3">{job.description}</p>
                    {user.role === "user" && (
                      job.applicants?.some(app => app._id === user._id) ? (
                        <button
                          className="group relative px-4 py-2 bg-green-100/30 backdrop-blur-sm text-green-700 rounded-lg border border-green-300 flex items-center gap-2 font-semibold shadow mt-4"
                          disabled
                        >
                          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                          Applied
                        </button>
                      ) : (
                        <button
                          className="group relative px-4 py-2 bg-white/10 backdrop-blur-sm text-indigo-700 rounded-lg border border-indigo-200 hover:bg-white/20 transition-all duration-300 flex items-center gap-2 font-semibold shadow mt-4"
                          onClick={(e) => {
                            e.stopPropagation();
                            applyToJob(job._id);
                          }}
                        >
                          Apply
                        </button>
                      )
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}

        {showJobModal && selectedJob && (
          <div className="modal modal-open">
            <div className="modal-box max-w-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold text-indigo-800">{selectedJob.title}</h3>
              <p className="text-lg">{selectedJob.company} — {selectedJob.location}</p>
              <span className="badge badge-outline badge-info">{selectedJob.category}</span>
              <p className="mt-4 whitespace-pre-line text-gray-700">{selectedJob.description}</p>

              {user.role === "user" && (
                selectedJob.applicants?.some(app => app._id === user._id) ? (
                  <button className="btn btn-disabled btn-outline mt-6 w-full">Applied</button>
                ) : (
                  <button
                    className="group relative px-4 py-2 bg-white/10 backdrop-blur-sm text-indigo-700 rounded-lg border border-indigo-200 hover:bg-white/20 transition-all duration-300 flex items-center gap-2 font-semibold shadow mt-6 w-full"
                    onClick={() => {
                      applyToJob(selectedJob._id);
                      setShowJobModal(false);
                    }}
                  >
                    Apply
                  </button>
                )
              )}

              {user.role === "admin" && selectedJob.applicants?.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold mb-2">Applicants:</h4>
                  <ul className="list-disc pl-6 text-sm text-gray-700">
                    {selectedJob.applicants.map((app) => (
                      <li key={app._id}>
                        {app.name} ({app.email})
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="modal-action">
                <button className="btn" onClick={() => setShowJobModal(false)}>Close</button>
              </div>
            </div>
            <div className="modal-backdrop" onClick={() => setShowJobModal(false)}></div>
          </div>
        )}
      </div>
    </div>
  );
}

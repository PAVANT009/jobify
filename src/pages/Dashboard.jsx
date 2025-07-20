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
  const [showLinkedInModal, setShowLinkedInModal] = useState(false);
  const [linkedinUrl, setLinkedinUrl] = useState("");

  useEffect(() => {
    if (!user) navigate("/login");
    // Show interest modal if user is regular user and has no interests
    if (user && user.role === "user" && (!user.interests || user.interests.length === 0)) {
      setShowInterestModal(true);
    }
    // Show LinkedIn modal if user doesn't have LinkedIn URL
    if (user && (!user.linkedin || user.linkedin.trim() === "")) {
      setShowLinkedInModal(true);
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
    // Validation: Check for empty required fields
    const requiredFields = ["title", "company", "location", "description", "category"];
    for (const field of requiredFields) {
      if (!form[field] || form[field].trim() === "") {
        showToast(`Please fill in the ${field} field.`, "error");
        return;
      }
    }
    // Optionally, check that at least one interest is selected
    if (form.interests.length === 0) {
      showToast("Please select at least one relevant interest.", "error");
      return;
    }
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


  const handleInterestChange = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmitInterests = async () => {
    try {
      await axios.put(
        `${API}/user/interests`,
        { interests: selectedInterests },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast("Interests saved!", "success");
      setShowInterestModal(false);
      window.location.reload(); 
    } catch {
      showToast("Failed to save interests", "error");
    }
  };

  const handleSubmitLinkedIn = async () => {
    try {
      await axios.put(
        `${API}/user/linkedin`,
        { linkedin: linkedinUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast("LinkedIn URL saved!", "success");
      setShowLinkedInModal(false);
      window.location.reload();
    } catch {
      showToast("Failed to save LinkedIn URL", "error");
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

      {/* LinkedIn URL Modal */}
      {showLinkedInModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-lg">
            <h3 className="text-xl font-bold mb-4 text-indigo-800">Add Your LinkedIn Profile</h3>
            <p className="text-gray-600 mb-4">Adding your LinkedIn profile helps employers learn more about you when you apply to jobs.</p>
            <input
              type="url"
              placeholder="https://linkedin.com/in/your-profile"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              className="input input-bordered w-full mb-4 border-indigo-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <div className="flex gap-2">
              <button
                className="btn btn-primary flex-1"
                onClick={handleSubmitLinkedIn}
              >
                Save LinkedIn
              </button>
              <button
                className="btn btn-outline flex-1"
                onClick={() => setShowLinkedInModal(false)}
              >
                Skip for Now
              </button>
            </div>
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
              className="input input-bordered border-indigo-300 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all duration-200 rounded-md px-5 py-3"
            />
            <input
              name="company"
              value={form.company}
              onChange={handleChange}
              placeholder="Company"
              className="input input-bordered border-indigo-300 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all duration-200 rounded-md px-5 py-3"
            />
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Location"
              className="input input-bordered border-indigo-300 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all duration-200 rounded-md px-5 py-3"
            />
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="select select-bordered border-indigo-300 bg-white text-indigo-800 focus:outline-none focus:ring-2 focus:ring-pink-400 rounded-md px-4 py-2 transition-all duration-200"
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
              className="textarea textarea-bordered md:col-span-2 border-indigo-300 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all duration-200 rounded-md px-5 py-3"
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
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
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
            <button
              onClick={() => {
                setLinkedinUrl(user.linkedin || "");
                setShowLinkedInModal(true);
              }}
              className="btn btn-outline btn-sm text-indigo-700 border-indigo-300 hover:bg-indigo-50"
            >
              {user.linkedin ? "Update LinkedIn" : "Add LinkedIn"}
            </button>
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
                      job.applicants?.some(app => app._id === user.id) ? (
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
            <div className={`modal-box max-w-2xl max-h-[90vh] overflow-y-auto ${user.role === 'admin' ? 'bg-gradient-to-br from-pink-50 via-indigo-50 to-purple-100 p-0 rounded-3xl shadow-2xl border border-indigo-200 pb-8' : ''}`}>
              {user.role === 'admin' ? (
                <>
                  <div className="rounded-t-2xl bg-gradient-to-r from-indigo-500 to-pink-500 px-8 py-6 flex flex-col gap-2">
                    <h3 className="text-3xl font-extrabold text-white drop-shadow">{selectedJob.title}</h3>
                    <div className="flex flex-col gap-1 mt-2">
                      <span className="text-white/90 font-semibold">Company: <span className="font-normal">{selectedJob.company}</span></span>
                      <span className="text-white/90 font-semibold">Location: <span className="font-normal">{selectedJob.location}</span></span>
                      <span className="text-white/90 font-semibold flex items-center gap-2">Category:
                        <span
                          className="badge text-indigo-700 font-semibold px-5 py-2 rounded-full border-8 ml-2 backdrop-blur-xl bg-white/10 shadow-lg border-white/40"
                          style={{
                            borderStyle: 'solid',
                            borderWidth: '6px',
                            borderRadius: '9999px',
                            display: 'inline-block',
                            boxShadow: '0 4px 24px 0 rgba(99,102,241,0.15)',
                            borderColor: 'rgba(255,255,255,0.4)',
                          }}
                        >
                          {selectedJob.category}
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="px-8 py-6">
                    <p className="mt-4 whitespace-pre-line text-gray-700">{selectedJob.description}</p>
                    {user.role === "admin" && selectedJob.applicants?.length > 0 && (
                      <div className="mt-8">
                        <h4 className="font-semibold mb-4 text-indigo-700 text-lg">Applicants:</h4>
                        {console.log('Applicants data:', selectedJob.applicants)}
                        <ul className="space-y-2">
                          {selectedJob.applicants.map((app) => (
                            <li
                              key={app._id}
                              className="bg-white/80 border border-indigo-100 rounded-lg px-4 py-2 flex flex-col sm:flex-row sm:items-center gap-1 shadow-sm"
                              style={{ cursor: app.linkedin ? 'pointer' : 'default' }}
                              onClick={() => {
                                if (app.linkedin && app.linkedin.trim() !== '') {
                                  window.open(app.linkedin, '_blank', 'noopener,noreferrer');
                                } else {
                                  showToast("No LinkedIn profile available for this user", "error");
                                }
                              }}
                              title={app.linkedin && app.linkedin.trim() !== '' ? 'View LinkedIn Profile' : 'No LinkedIn profile available'}
                            >
                              <span className="font-medium text-indigo-800">{app.name}</span>
                              <span className="text-gray-500 text-xs">({app.email})</span>
                              {app.linkedin && app.linkedin.trim() !== '' ? (
                                <span className="ml-2 text-blue-600 underline text-xs">LinkedIn</span>
                              ) : (
                                <span className="ml-2 text-gray-400 text-xs">No LinkedIn</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-indigo-800">{selectedJob.title}</h3>
                  <p className="text-lg">{selectedJob.company} — {selectedJob.location}</p>
                  <span className="badge badge-outline badge-info">{selectedJob.category}</span>
                  <p className="mt-4 whitespace-pre-line text-gray-700">{selectedJob.description}</p>
                  {user.role === "user" && (
                    selectedJob.applicants?.some(app => app._id === user.id) ? (
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
                </>
              )}
              <div className="modal-action mt-8 flex justify-center items-center">
                <button
                  className={`btn ${user.role === 'admin' ? 'bg-red-500 hover:bg-red-600 text-white rounded-full font-bold text-lg px-8 py-3 shadow-lg border-none' : ''}`}
                  onClick={() => setShowJobModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
            <div className="modal-backdrop" onClick={() => setShowJobModal(false)}></div>
          </div>
        )}
      </div>
    </div>
  );
}


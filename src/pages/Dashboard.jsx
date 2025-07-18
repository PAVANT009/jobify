import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";

const API = "http://localhost:5000/api";

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
  });
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobModal, setShowJobModal] = useState(false);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user]);

  useEffect(() => {
    const fetchJobs = async () => {
      const res = await axios.get(`${API}/job/all`);
      setJobs(res.data);
      setLoading(false);
    };
    fetchJobs();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const postJob = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/job/create`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm({ title: "", company: "", location: "", description: "", category: "Frontend Developer" });
      showToast("Job posted successfully!", "success");
      window.location.reload();
    } catch {
      showToast("Failed to post job", "error");
    }
  };

  const applyToJob = async (id) => {
    try {
      await axios.post(
        `${API}/job/apply/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast("Applied successfully!", "success");
      window.location.reload();
    } catch {
      showToast("Failed to apply to job", "error");
    }
  };

  if (!user) return null;

  return (
    <div className="p-6 bg-base-200 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Welcome {user.name} 👋</h2>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : (
          <>
            {user.role === "admin" ? (
              <>
                <h3 className="text-xl font-semibold mb-2">Post a New Job</h3>
                <form onSubmit={postJob} className="card bg-base-100 shadow-xl border border-neutral p-6 grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 rounded-xl">
                  <input name="title" value={form.title} onChange={handleChange} placeholder="Job Title" className="input input-bordered w-full" />
                  <input name="company" value={form.company} onChange={handleChange} placeholder="Company" className="input input-bordered w-full" />
                  <input name="location" value={form.location} onChange={handleChange} placeholder="Location" className="input input-bordered w-full" />
                  <select name="category" value={form.category} onChange={handleChange} className="select select-bordered w-full">
                    <option value="Frontend Developer">Frontend Developer</option>
                    <option value="Backend Developer">Backend Developer</option>
                    <option value="Full Stack Developer">Full Stack Developer</option>
                    <option value="Mobile Developer">Mobile Developer</option>
                    <option value="DevOps Engineer">DevOps Engineer</option>
                    <option value="Data Scientist">Data Scientist</option>
                    <option value="Machine Learning Engineer">Machine Learning Engineer</option>
                    <option value="QA Engineer">QA Engineer</option>
                    <option value="UI/UX Designer">UI/UX Designer</option>
                    <option value="Product Manager">Product Manager</option>
                    <option value="Project Manager">Project Manager</option>
                    <option value="Business Analyst">Business Analyst</option>
                    <option value="System Administrator">System Administrator</option>
                    <option value="Database Administrator">Database Administrator</option>
                    <option value="Security Engineer">Security Engineer</option>
                    <option value="Cloud Engineer">Cloud Engineer</option>
                  </select>
                  <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="textarea textarea-bordered col-span-1 md:col-span-2" />
                  <button type="submit" className="btn btn-primary col-span-1 md:col-span-2">
                    Post Job
                  </button>
                </form>
              </>
            ) : (
              <p className="mb-4 text-gray-600">Browse and apply to jobs below 👇</p>
            )}

            {user.role !== "admin" && (
              <div className="mb-4">
                <label className="mr-2 font-semibold">Filter by Category:</label>
                <select
                  value={categoryFilter}
                  onChange={e => setCategoryFilter(e.target.value)}
                  className="select select-bordered"
                >
                  <option value="All">All</option>
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="Full Stack Developer">Full Stack Developer</option>
                  <option value="Mobile Developer">Mobile Developer</option>
                  <option value="DevOps Engineer">DevOps Engineer</option>
                  <option value="Data Scientist">Data Scientist</option>
                  <option value="Machine Learning Engineer">Machine Learning Engineer</option>
                  <option value="QA Engineer">QA Engineer</option>
                  <option value="UI/UX Designer">UI/UX Designer</option>
                  <option value="Product Manager">Product Manager</option>
                  <option value="Project Manager">Project Manager</option>
                  <option value="Business Analyst">Business Analyst</option>
                  <option value="System Administrator">System Administrator</option>
                  <option value="Database Administrator">Database Administrator</option>
                  <option value="Security Engineer">Security Engineer</option>
                  <option value="Cloud Engineer">Cloud Engineer</option>
                </select>
              </div>
            )}

            <div className="grid gap-6">
              {jobs
                .filter(job => categoryFilter === "All" || job.category === categoryFilter)
                .map((job) => (
                  <div key={job._id} className="card bg-base-100 shadow-xl border border-neutral p-6 cursor-pointer rounded-xl" onClick={() => { setSelectedJob(job); setShowJobModal(true); }}>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div>
                        <h4 className="text-lg font-bold">{job.title}</h4>
                        <p className="text-sm">{job.company} — {job.location}</p>
                        <span className="badge badge-info badge-outline mt-1">{job.category}</span>
                        <p className="mt-2 text-gray-600">{job.description}</p>
                      </div>
                      <div className="flex flex-col gap-2 md:items-end md:justify-end">
                        {user.role === "user" && (
                          job.applicants && job.applicants.some(applicant => applicant._id === user._id) ? (
                            <button
                              className="btn btn-disabled btn-outline mt-3"
                              disabled
                            >
                              Applied
                            </button>
                          ) : (
                            <button
                              onClick={e => { e.stopPropagation(); applyToJob(job._id); }}
                              className="btn btn-primary mt-3"
                            >
                              Apply
                            </button>
                          )
                        )}
                      </div>
                    </div>
                    {user.role === "admin" && job.applicants && job.applicants.length > 0 && (
                      <div className="mt-4">
                        <h5 className="font-semibold mb-1">Applicants:</h5>
                        <ul className="list-disc list-inside">
                          {job.applicants.map((applicant) => (
                            <li key={applicant._id}>
                              {applicant.name} ({applicant.email})
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
            </div>

            {/* Job Details Modal */}
            {showJobModal && selectedJob && (
              <div className="modal modal-open">
                <div className="modal-box max-w-2xl">
                  <h3 className="font-bold text-2xl mb-2">{selectedJob.title}</h3>
                  <p className="text-lg mb-1">{selectedJob.company} — {selectedJob.location}</p>
                  <span className="badge badge-info badge-outline mb-2">{selectedJob.category}</span>
                  <p className="mt-2 text-gray-700 whitespace-pre-line">{selectedJob.description}</p>
                  {user.role === "user" && (
                    selectedJob.applicants && selectedJob.applicants.some(applicant => applicant._id === user._id) ? (
                      <button className="btn btn-disabled btn-outline mt-6 w-full" disabled>Applied</button>
                    ) : (
                      <button className="btn btn-primary mt-6 w-full" onClick={() => { applyToJob(selectedJob._id); setShowJobModal(false); }}>
                        Apply
                      </button>
                    )
                  )}
                  <div className="modal-action">
                    <button className="btn" onClick={() => setShowJobModal(false)}>Close</button>
                  </div>
                </div>
                <div className="modal-backdrop" onClick={() => setShowJobModal(false)}></div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

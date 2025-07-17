import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000/api";

export default function Dashboard() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    category: "Frontend Developer",
  });
  const [categoryFilter, setCategoryFilter] = useState("All");

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user]);

  useEffect(() => {
    const fetchJobs = async () => {
      const res = await axios.get(`${API}/job/all`);
      setJobs(res.data);
    };
    fetchJobs();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const postJob = async (e) => {
    e.preventDefault();
    await axios.post(`${API}/job/create`, form, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setForm({ title: "", company: "", location: "", description: "", category: "Frontend Developer" });
    window.location.reload();
  };

  const applyToJob = async (id) => {
    await axios.post(
      `${API}/job/apply/${id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert("Applied ✅");
  };

  console.log(jobs,"user: ", user )

  if (!user) return null;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Welcome {user.name} ��</h2>
      </div>

      {user.role === "admin" ? (
        <>
          <h3 className="text-xl font-semibold mb-2">Post a New Job</h3>
          <form onSubmit={postJob} className="grid grid-cols-2 gap-4 mb-6">
            <input name="title" value={form.title} onChange={handleChange} placeholder="Job Title" className="border p-2 rounded" />
            <input name="company" value={form.company} onChange={handleChange} placeholder="Company" className="border p-2 rounded" />
            <input name="location" value={form.location} onChange={handleChange} placeholder="Location" className="border p-2 rounded" />
            <select name="category" value={form.category} onChange={handleChange} className="border p-2 rounded">
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
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="border p-2 rounded col-span-2" />
            <button type="submit" className="bg-black text-white col-span-2 py-2 rounded hover:bg-gray-800">
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
            className="border p-2 rounded"
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

      <div className="grid gap-4">
        {jobs
          .filter(job => categoryFilter === "All" || job.category === categoryFilter)
          .map((job) => (
            <div key={job._id} className="p-4 border rounded shadow-sm">
              <h4 className="text-lg font-bold">{job.title}</h4>
              <p className="text-sm">{job.company} — {job.location}</p>
              <p className="text-sm font-semibold mt-1">Category: {job.category}</p>
              <p className="mt-2 text-gray-600">{job.description}</p>

              {user.role === "user" && (
                job.applicants && job.applicants.some(applicant => applicant._id === user._id) ? (
                  <button
                    className="mt-3 px-4 py-2 bg-gray-400 text-white rounded cursor-not-allowed"
                    disabled
                  >
                    Applied
                  </button>
                ) : (
                  <button
                    onClick={() => applyToJob(job._id)}
                    className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Apply
                  </button>
                )
              )}

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
    </div>
  );
}

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API = "http://localhost:5000/api";

export default function MyApplications() {
  const { token } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      const res = await axios.get(`${API}/job/applied`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(res.data);
      setLoading(false);
    };
    fetchAppliedJobs();
  }, [token]);

  return (
    <div className="p-6 bg-base-200 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Jobs You've Applied To</h2>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : jobs.length === 0 ? (
          <p className="text-gray-600">You haven't applied to any jobs yet.</p>
        ) : (
          <div className="grid gap-6">
            {jobs.map((job) => (
              <div key={job._id} className="card bg-base-100 shadow-xl border border-neutral p-6 rounded-xl">
                <h4 className="text-lg font-bold">{job.title}</h4>
                <p className="text-sm">{job.company} — {job.location}</p>
                <span className="badge badge-info badge-outline mt-1">{job.category}</span>
                <p className="mt-2 text-gray-600">{job.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 
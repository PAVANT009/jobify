import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API = "http://localhost:5000/api";

export default function MyApplications() {
  const { token } = useAuth();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      const res = await axios.get(`${API}/job/applied`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(res.data);
    };
    fetchAppliedJobs();
  }, [token]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Jobs You've Applied To</h2>
      {jobs.length === 0 ? (
        <p className="text-gray-600">You haven't applied to any jobs yet.</p>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <div key={job._id} className="p-4 border rounded shadow-sm">
              <h4 className="text-lg font-bold">{job.title}</h4>
              <p className="text-sm">{job.company} — {job.location}</p>
              <p className="text-sm font-semibold mt-1">Category: {job.category}</p>
              <p className="mt-2 text-gray-600">{job.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 
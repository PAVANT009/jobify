import express from "express";
import mongoose from "mongoose";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Job model
const jobSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  description: String,
  category: {
    type: String,
    enum: [
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
      "Cloud Engineer"
    ],
    required: true
  },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});
const Job = mongoose.model("Job", jobSchema);

// Admin: POST /api/job/create
router.post("/create", verifyToken, isAdmin, async (req, res) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// All Users: GET /api/job/all
router.get("/all", async (req, res) => {
  try {
    const jobs = await Job.find().populate("applicants", "name email");
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Users: POST /api/job/apply/:id
router.post("/apply/:id", verifyToken, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ msg: "Job not found" });

    if (job.applicants.includes(req.user.id))
      return res.status(400).json({ msg: "Already applied" });

    job.applicants.push(req.user.id);
    await job.save();

    res.json({ msg: "Applied successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Users: GET /api/job/applied
router.get("/applied", verifyToken, async (req, res) => {
  try {
    const jobs = await Job.find({ applicants: req.user.id });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;

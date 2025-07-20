import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

// GET /api/user/profile
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// PUT /api/user/interests
router.put("/interests", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });
    if (user.role !== "user") return res.status(403).json({ msg: "Only users can update interests" });
    user.interests = Array.isArray(req.body.interests) ? req.body.interests : [];
    await user.save();
    res.json({ interests: user.interests });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// PUT /api/user/linkedin
router.put("/linkedin", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });
    
    user.linkedin = req.body.linkedin || "";
    await user.save();
    res.json({ linkedin: user.linkedin });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;

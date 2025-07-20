// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import jobRoutes from "./routes/job.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 'https://jobify-c04l.onrender.com/';

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  'https://jobify.vercel.app',
  'https://jobify-virid.vercel.app',  
];

function corsOptionsDelegate(req, callback) {
  const origin = req.header('Origin');
  if (
    allowedOrigins.includes(origin) ||
    /^https:\/\/jobify-[\w-]+\.vercel\.app$/.test(origin)  
  ) {
    callback(null, { origin: true, credentials: true });
  } else {
    callback(null, { origin: false });
  }
}

app.use(cors(corsOptionsDelegate));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/job", jobRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Root route
app.get("/", (req, res) => {
  res.send("JobBoard API is live 🚀");
});

// Start server
app.listen(PORT, () => {
  console.log(`⚡ Server running on port ${PORT}`);
});

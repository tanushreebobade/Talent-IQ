import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import Submission from "../models/Submission.js";

const router = express.Router();

// POST /api/submissions - Create a new problem submission
router.post("/", protectRoute, async (req, res) => {
  try {
    const { problemId, language, code, status, runtime, output, error } = req.body;
    const clerkId = req.auth().userId;

    if (!problemId || !language || !code || !status) {
      return res.status(400).json({
        message: "Missing required fields: problemId, language, code, status",
      });
    }

    const submission = await Submission.create({
      user: req.user._id,
      clerkId,
      problemId,
      code,
      language,
      status,
      runtime: typeof runtime === "number" ? Math.round(runtime) : 0,
      output: output || "",
      error: error || "",
    });

    return res.status(201).json({
      success: true,
      submission,
    });
  } catch (err) {
    console.error("Error creating submission:", err);
    return res.status(500).json({ message: "Failed to record submission" });
  }
});

// GET /api/submissions/:problemId - Get user's submission history for a specific problem
router.get("/:problemId", protectRoute, async (req, res) => {
  try {
    const { problemId } = req.params;
    const clerkId = req.auth().userId;

    const submissions = await Submission.find({ clerkId, problemId })
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      success: true,
      submissions,
    });
  } catch (err) {
    console.error("Error fetching submission history:", err);
    return res.status(500).json({ message: "Failed to fetch submission history" });
  }
});

export default router;

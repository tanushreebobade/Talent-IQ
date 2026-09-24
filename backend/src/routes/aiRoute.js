import express from "express";
import { getAiHint, getErrorExplanation } from "../controllers/aiController.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/hint", protectRoute, getAiHint);
router.post("/explain-error", protectRoute, getErrorExplanation);

export default router;

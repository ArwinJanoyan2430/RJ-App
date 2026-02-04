import express from "express";
import { getMe, updateMe } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

router.get("/me", requireAuth, getMe);
router.put("/me", requireAuth, updateMe);

export default router;

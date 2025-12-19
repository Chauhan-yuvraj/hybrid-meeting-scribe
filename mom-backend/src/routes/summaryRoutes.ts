import { Router } from "express";
import { createSummary } from "../controllers/summaryController";

const router = Router();

router.post("/", createSummary);

export default router;

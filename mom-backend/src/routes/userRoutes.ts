import express from "express";
import upload from "../middleware/uploadMiddleware"; // Assuming you have multer here
import { InitTranscription, CheckStatus, listAvailableModels, InitWhisperTranscription } from "../controllers/userController";

const router = express.Router();


router.post("/", upload.single("audio"), InitTranscription);
router.post("/whisper", upload.single("audio"), InitWhisperTranscription);
router.get("/status/:id", CheckStatus);

export default router;
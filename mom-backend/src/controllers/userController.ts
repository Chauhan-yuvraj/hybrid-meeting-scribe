  // controllers/userController.ts
import { Request, Response } from "express";
import { startTranscription, getTranscriptionStatus } from "../service/textToSpeech.service";
import { transcribeAudioStream } from "../service/whisper.service";
import { CONFIG } from "../config/env";

// Add this to test which models are available
export const listAvailableModels = async () => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${CONFIG.GOOGLE_API_KEY}`
    );
    const data = await response.json();
    console.log("Available models:", data.models.map((m: any) => m.name));
  } catch (error) {
    console.error("Error listing models:", error);
  }
};

export const InitTranscription = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const transcriptId = await startTranscription(req.file.path);

    console.log("Transcription started with ID:", transcriptId);

    return res.json({
      message: "File uploaded successfully. Transcription started.",
      transcriptId: transcriptId,
      status: "queued"
    });

  } catch (error: any) {
    console.error("Upload error:", error);
    return res.status(500).json({ message: "Error starting transcription", error: error?.message });
  }
};

export const CheckStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id) return res.status(400).json({ message: "Transcript ID is required" });

    // Decode the URL-encoded file ID
    const decodedId = decodeURIComponent(id);
    
    console.log("Received encoded ID:", id);
    console.log("Decoded ID:", decodedId);
    
    const data = await getTranscriptionStatus(decodedId);

    if (data.status === "processing" || data.status === "queued") {
      return res.json({ 
        message: "Transcription is in progress...", 
        status: data.status 
      });
    }

    if (data.status === "completed") {
      return res.json({ 
        message: "Transcription successful", 
        status: "completed", 
        text: data.text 
      });
    }

    return res.status(500).json({ message: "Transcription failed", error: data.error });

  } catch (error: any) {
    console.error("Status check error:", error);
    return res.status(500).json({ message: "Error checking status", error: error?.message });
  }
};

export const InitWhisperTranscription = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Disable buffering for Nginx/proxies
    res.flushHeaders(); // Flush headers immediately

    await transcribeAudioStream(req.file.path, (data) => {
        // Send data to client
        res.write(`data: ${JSON.stringify(data)}\n\n`);
        // Try to flush if the method exists (e.g. if compression middleware is added later)
        if ((res as any).flush) (res as any).flush();
    });

    // End the stream
    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
    res.end();

  } catch (error: any) {
    console.error("Whisper Upload error:", error);
    // If headers are already sent, we can't send a JSON error response
    if (!res.headersSent) {
        return res.status(500).json({ message: "Error starting transcription", error: error?.message });
    } else {
        res.write(`data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`);
        res.end();
    }
  }
};

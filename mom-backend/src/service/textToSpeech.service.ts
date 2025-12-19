// service/textToSpeech.service.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager, FileState } from "@google/generative-ai/server";
import { CONFIG } from "../config/env";
import path from "path";

// Initialize the SDKs
const fileManager = new GoogleAIFileManager(CONFIG.GOOGLE_API_KEY);
const genAI = new GoogleGenerativeAI(CONFIG.GOOGLE_API_KEY);

// Helper to determine mime type based on file extension
const getMimeType = (filePath: string): string => {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".mp3": return "audio/mp3";
    case ".wav": return "audio/wav";
    case ".m4a": return "audio/x-m4a";
    case ".ogg": return "audio/ogg";
    default: return "audio/mp3";
  }
};

// 1. Upload and START
export const startTranscription = async (filePath: string) => {
  try {
    const mimeType = getMimeType(filePath);

    const uploadResponse = await fileManager.uploadFile(filePath, {
      mimeType: mimeType,
      displayName: "Audio Transcription Job",
    });

    console.log(`Uploaded file ${uploadResponse.file.displayName} as: ${uploadResponse.file.name}`);

    return uploadResponse.file.name;

  } catch (error: any) {
    console.error("Upload Error:", error);
    throw new Error("Failed to upload audio to Gemini: " + error.message);
  }
};

// 2. CHECK status and GENERATE transcript
export const getTranscriptionStatus = async (fileId: string) => {
  try {
    // 1. Check the processing state
    const file = await fileManager.getFile(fileId);

    if (file.state === FileState.PROCESSING) {
      return { id: fileId, status: "processing", text: null };
    }

    if (file.state === FileState.FAILED) {
      return { id: fileId, status: "error", error: "Audio processing failed by Google." };
    }

    // 2. If ACTIVE, trigger transcription
    if (file.state === FileState.ACTIVE) {
      // ✅ FIX: Use the correct model name
      // Options: "gemini-2.0-flash", "gemini-2.5-flash", "gemini-flash-latest"
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

      const prompt = `
        Please transcribe the following audio file. 
        Identify different speakers (e.g., Speaker 1, Speaker 2).
        Format the output clearly.
      `;

      const result = await model.generateContent([
        {
          fileData: {
            mimeType: file.mimeType,
            fileUri: file.uri,
          },
        },
        { text: prompt },
      ]);

      const response = await result.response;
      const text = response.text();

      // Optional: Cleanup
      // await fileManager.deleteFile(fileId);

      return {
        id: fileId,
        status: "completed",
        text: text,
        error: null,
      };
    }

    return { id: fileId, status: "processing", text: null };

  } catch (error: any) {
    console.error("Gemini Transcription Error:", error);

    // Handle Rate Limiting (429)
    if (error.status === 429 || error.message?.includes("429")) {
        console.log("Rate limit hit. Retrying later...");
        return { id: fileId, status: "processing", text: null };
    }

    return {
      id: fileId,
      status: "error",
      text: null,
      error: error.message,
    };
  }
};
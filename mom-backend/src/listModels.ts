
import dotenv from "dotenv";
dotenv.config();
import { CONFIG } from "./config/env";

async function listModels() {
  try {
    console.log("Fetching models...");
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${CONFIG.GOOGLE_API_KEY}`);
    const data = await response.json();
    if (data.models) {
        console.log("Available Models:");
        data.models.forEach((m: any) => {
            if (m.name.includes("gemini")) {
                console.log(`- ${m.name} (${m.supportedGenerationMethods.join(", ")})`);
            }
        });
    } else {
        console.log("No models found or error:", data);
    }
  } catch (error) {
    console.error("Error listing models:", error);
  }
}

listModels();

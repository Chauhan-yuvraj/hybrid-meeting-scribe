import { Request, Response } from "express";
import { generateSummaryOrMom } from "../services/summaryService";

export const createSummary = async (req: Request, res: Response) => {
  try {
    const { text, type, provider } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Text content is required" });
    }

    const result = await generateSummaryOrMom(text, type, provider);

    res.json({ 
      message: "Content generated successfully", 
      data: result 
    });

  } catch (error: any) {
    console.error("Summary generation error:", error);
    res.status(500).json({ message: "Error generating content", error: error.message });
  }
};

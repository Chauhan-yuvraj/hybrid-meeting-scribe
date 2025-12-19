import axios from "axios";

const OLLAMA_MODEL = "llama3"; 

// 2. Local fallback if Gemini fails (or if you want to use Local only)
export const generateSummaryOrMom = async (text: string, type?: 'meeting' | 'other', provider: 'gemini' | 'ollama' = 'ollama') => {
  try {
    // --- ADVANCED PROMPT ENGINEERING ---
    const baseInstruction = `
      You are a Senior Business Analyst and Technical Writer.
      Your task is to analyze a raw transcript from a recording.
      
      CRITICAL INSTRUCTIONS:
      1. LANGUAGE: The input text may contain English, Hindi, and Gujarati. You MUST process all input but output the final report STRICTLY IN PROFESSIONAL ENGLISH.
      2. DETAIL LEVEL: Do not summarize briefly. Be exhaustive. Capture technical details, specific numbers, and names.
      3. STRUCTURE: Use Markdown formatting.
    `;

    let specificPrompt = "";

    if (type === 'meeting') {
      specificPrompt = `
        TASK: Generate a Comprehensive Minutes of Meeting (MOM) Report.
        
        REQUIRED OUTPUT STRUCTURE:
        
        # 1. Executive Summary
        (A 5-6 sentence high-level overview of the meeting's purpose and outcome.)

        # 2. Detailed Topic Analysis
        (Identify the distinct topics discussed. For EACH topic, create a subsection:)
        ## Topic: [Topic Name]
        *   **Context:** What triggered this discussion?
        *   **Key Arguments:** Detailed bullet points of who said what (if distinguishable), valid points raised, and concerns mentioned.
        *   **Conclusion:** What was the final consensus or ending thought on this specific topic?

        # 3. Decisions Log
        (List every firm decision made, even small ones.)

        # 4. Action Items Table
        (Format as: Who | What | By When | Priority)

        # 5. Open Issues / Parking Lot
        (Items discussed but not resolved.)
      `;
    } else if (type === 'other') {
      specificPrompt = `
        TASK: Generate a Detailed Content Analysis.
        
        REQUIRED OUTPUT STRUCTURE:
        # 1. Abstract
        # 2. Key Themes & Concepts (Go into depth for each theme)
        # 3. Chronological Flow (How the narrative progressed)
        # 4. Critical Insights & Takeaways
      `;
    } else {
      // Auto-detect Mode
      specificPrompt = `
        TASK: Analyze the text type and generate the appropriate report.
        IF MEETING: Generate the "Comprehensive Minutes of Meeting" structure defined above.
        IF GENERAL: Generate the "Detailed Content Analysis" structure defined above.
        Start your response with a header: "### TYPE DETECTED: [Meeting/General]"
      `;
    }

    // Combine instructions
    const finalPrompt = `
      ${baseInstruction}
      ${specificPrompt}

      ----------------
      RAW TRANSCRIPT DATA:
      ${text}
      ----------------
    `;

    console.log(`Generating detailed summary using Local AI (${OLLAMA_MODEL})...`);

    // --- OLLAMA CALL (Optimized) ---
    try {
        const response = await axios.post('http://localhost:11434/api/generate', {
          model: OLLAMA_MODEL, 
          prompt: finalPrompt,
          stream: false,
          
          // CRITICAL SETTINGS FOR DETAIL
          options: { 
            // 0. GPU Acceleration: Offload all layers to GPU for speed
            num_gpu: 999,

            // 1. Context Window: 8192 tokens allows it to read ~30-40 mins of text at once.
            //    Default is only 2048, which cuts off long meetings.
            num_ctx: 8192, 

            // 2. Temperature: 0.2 makes it precise/factual. 
            //    Higher (0.7) makes it "creative" (bad for minutes).
            temperature: 0.2,
            
            // 3. Prediction length: Allow it to write long reports (don't cut off mid-sentence)
            num_predict: -1 
          }
        });
        return response.data.response;

    } catch (error: any) {
        console.error("Ollama Error:", error.message);
        throw new Error("Failed to generate summary with Ollama. Is 'ollama serve' running?");
    }

  } catch (error: any) {
    console.error("Error generating summary/MOM:", error);
    throw new Error("Failed to generate content: " + error.message);
  }
};
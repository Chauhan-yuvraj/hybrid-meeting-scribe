import axios from 'axios';

const generateMOM = async (transcriptText) => {
    const prompt = `
    You are an expert Executive Assistant. 
    Analyze the following meeting transcript. The text may contain mixed English, Hindi, and Gujarati.
    
    Transcript:
    "${transcriptText}"
    
    Generate Minutes of the Meeting (MOM) in ENGLISH with the following structure:
    1. Meeting Summary (3-4 sentences)
    2. Key Discussion Points (Bulleted list)
    3. Action Items (Who needs to do what)
    
    Do not output markdown code blocks, just the text.
    `;

    try {
        const response = await axios.post('http://localhost:11434/api/generate', {
            model: "llama3",
            prompt: prompt,
            stream: false // specific to Ollama API to get full JSON at once
        });
        return response.data.response;
    } catch (error) {
        console.error("LLM Error:", error.message);
        return "Failed to generate summary.";
    }
};

module.exports = { generateMOM };
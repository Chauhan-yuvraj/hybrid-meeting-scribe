import { useState, useRef, useEffect } from "react";

export type ProcessStatus = "idle" | "uploading" | "processing" | "completed" | "error";
export type MomStatus = "idle" | "loading" | "completed" | "error";

export const useAudioProcessing = () => {
  const [file, setFile] = useState<File | null>(null);
  const [transcript, setTranscript] = useState<string>("");
  const [model, setModel] = useState<"gemini" | "whisper">("gemini");
  
  const [status, setStatus] = useState<ProcessStatus>("idle");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);

  const [momStatus, setMomStatus] = useState<MomStatus>("idle");
  const [momResult, setMomResult] = useState<string>("");

  const pollingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pollingCountRef = useRef<number>(0);
  const maxPollingAttempts = 60;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollingTimeoutRef.current) clearTimeout(pollingTimeoutRef.current);
    };
  }, []);

  const resetState = () => {
    if (pollingTimeoutRef.current) clearTimeout(pollingTimeoutRef.current);
    setFile(null);
    setTranscript("");
    setStatus("idle");
    setStatusMessage("");
    setProgress(0);
    setMomStatus("idle");
    setMomResult("");
    pollingCountRef.current = 0;
  };

  const checkTranscriptionStatus = async (transcriptId: string) => {
    try {
      pollingCountRef.current += 1;

      if (pollingCountRef.current > maxPollingAttempts) {
        setStatus("error");
        setStatusMessage("Transcription timeout. Please try again with a shorter audio file.");
        return;
      }

      const encodedId = encodeURIComponent(transcriptId);
      const url = `http://localhost:8000/api/upload/status/${encodedId}`;
      const response = await fetch(url);

      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

      const data = await response.json();

      if (data.status === "completed") {
        setTranscript(data.text);
        setStatus("completed");
        setStatusMessage("Transcription Complete!");
        setProgress(100);
      } else if (data.status === "error") {
        setStatus("error");
        setStatusMessage("Transcription failed: " + (data.error || "Unknown error"));
      } else {
        // Calculate progress
        const estimatedProgress = Math.min(90, (pollingCountRef.current / maxPollingAttempts) * 100);
        setProgress(estimatedProgress);
        
        const elapsed = pollingCountRef.current * 3;
        setStatusMessage(`Status: ${data.status}... (${elapsed}s elapsed)`);

        // Exponential backoff
        const delay = pollingCountRef.current < 5 ? 3000 : pollingCountRef.current < 10 ? 5000 : 10000;
        pollingTimeoutRef.current = setTimeout(() => checkTranscriptionStatus(transcriptId), delay);
      }
    } catch (error) {
      console.error("Polling error:", error);
      setStatus("error");
      setStatusMessage(`Network error: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  const uploadFile = async () => {
    if (!file) return;

    if (pollingTimeoutRef.current) clearTimeout(pollingTimeoutRef.current);

    setStatus("uploading");
    setStatusMessage("Uploading file...");
    setTranscript("");
    setProgress(10);
    pollingCountRef.current = 0;

    const formData = new FormData();
    formData.append("audio", file);

    try {
      if (model === "whisper") {
        await handleWhisperUpload(formData);
      } else {
        await handleGeminiUpload(formData);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setStatus("error");
      setStatusMessage(`Upload error: ${error instanceof Error ? error.message : "Unknown error"}`);
      setProgress(0);
    }
  };

  const handleGeminiUpload = async (formData: FormData) => {
    const response = await fetch("http://localhost:8000/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (response.ok && data.transcriptId) {
      setStatus("processing");
      setStatusMessage("File uploaded. Processing audio with Gemini...");
      setProgress(30);
      checkTranscriptionStatus(data.transcriptId);
    } else {
      throw new Error(data.message || "Upload failed");
    }
  };

  const handleWhisperUpload = async (formData: FormData) => {
    const response = await fetch("http://localhost:8000/api/upload/whisper", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Upload failed");
    if (!response.body) throw new Error("No response body");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    setStatus("processing");
    setStatusMessage("Transcribing with Whisper...");
    setTranscript("");

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      buffer += chunk;
      
      const lines = buffer.split("\n\n");
      buffer = lines.pop() || ""; // Keep the last partial line in buffer
      
      for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith("data: ")) {
          const jsonStr = trimmedLine.replace("data: ", "").trim();
          if (jsonStr === "[DONE]" || jsonStr.includes('"type":"done"')) {
            setStatus("completed");
            setStatusMessage("Transcription Complete!");
            setProgress(100);
            return;
          }
          
          try {
            const data = JSON.parse(jsonStr);
            if (data.type === "segment") {
              setTranscript(prev => prev + data.text + " ");
            } else if (data.type === "meta") {
                setStatusMessage(`Transcribing (${data.language})...`);
            }
          } catch (e) {
            // Silent fail for partial JSON
          }
        }
      }
    }
  };

  const generateMOM = async () => {
    if (!transcript) return;

    setMomStatus("loading");
    try {
      const response = await fetch("http://localhost:8000/api/summary/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          text: transcript, 
          type: "mom",
          provider: "ollama"
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMomResult(data.data);
        setMomStatus("completed");
      } else {
        setMomStatus("error");
        alert(data.message || "Failed to generate MOM");
      }
    } catch (error) {
      console.error("Error generating MOM:", error);
      setMomStatus("error");
      alert("Error generating MOM");
    }
  };

  return {
    file,
    setFile,
    transcript,
    model,
    setModel,
    status,
    statusMessage,
    progress,
    momStatus,
    momResult,
    uploadFile,
    generateMOM,
    resetState,
  };
};
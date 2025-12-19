import { useState, useRef, useEffect } from "react";

export type TranscriptionStatus = "idle" | "uploading" | "processing" | "completed" | "error";
export type MomStatus = "idle" | "loading" | "completed" | "error";

export const useTranscription = () => {
  const [file, setFile] = useState<File | null>(null);
  const [transcript, setTranscript] = useState<string>("");
  
  // UI States
  const [status, setStatus] = useState<TranscriptionStatus>("idle");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);

  // MOM Generation States
  const [momStatus, setMomStatus] = useState<MomStatus>("idle");
  const [momResult, setMomResult] = useState<string>("");

  // Refs to manage polling and prevent memory leaks
  const pollingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pollingCountRef = useRef<number>(0);
  const maxPollingAttempts = 60; // 3 minutes max (60 * 3 seconds)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollingTimeoutRef.current) {
        clearTimeout(pollingTimeoutRef.current);
      }
    };
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      
      // Validate file size (100MB limit)
      const maxSize = 100 * 1024 * 1024;
      if (selectedFile.size > maxSize) {
        alert("File is too large. Maximum size is 100MB.");
        return;
      }

      // Validate file type
      const allowedTypes = ["audio/mp3", "audio/mpeg", "audio/wav", "audio/x-m4a", "audio/ogg"];
      if (!allowedTypes.some(type => selectedFile.type.includes(type.split('/')[1]))) {
        alert("Please select a valid audio file (MP3, WAV, M4A, OGG)");
        return;
      }

      setFile(selectedFile);
      setTranscript("");
      setStatus("idle");
      setStatusMessage("");
      setProgress(0);
      setMomStatus("idle");
      setMomResult("");
      pollingCountRef.current = 0;
    }
  };

  // Improved polling with exponential backoff and max attempts
  const checkTranscriptionStatus = async (transcriptId: string) => {
    try {
      pollingCountRef.current += 1;

      // Check if we've exceeded max attempts
      if (pollingCountRef.current > maxPollingAttempts) {
        setStatus("error");
        setStatusMessage("Transcription timeout. Please try again with a shorter audio file.");
        return;
      }

      // CRITICAL: Encode the transcriptId to handle forward slashes
      const encodedId = encodeURIComponent(transcriptId);
      
      const url = `http://localhost:8000/api/upload/status/${encodedId}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

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
        // Update progress based on polling attempts
        const estimatedProgress = Math.min(90, (pollingCountRef.current / maxPollingAttempts) * 100);
        setProgress(estimatedProgress);
        
        // Dynamic status message
        const elapsed = pollingCountRef.current * 3;
        setStatusMessage(`Status: ${data.status}... (${elapsed}s elapsed)`);
        
        // Exponential backoff: 3s, 3s, 5s, 5s, 10s...
        const delay = pollingCountRef.current < 5 ? 3000 : 
                      pollingCountRef.current < 10 ? 5000 : 10000;
        
        pollingTimeoutRef.current = setTimeout(() => 
          checkTranscriptionStatus(transcriptId), delay
        );
      }
    } catch (error) {
      console.error("Polling error:", error);
      setStatus("error");
      setStatusMessage(`Network error: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }

    // Clear any existing polling
    if (pollingTimeoutRef.current) {
      clearTimeout(pollingTimeoutRef.current);
    }

    setStatus("uploading");
    setStatusMessage("Uploading file...");
    setTranscript("");
    setProgress(10);
    pollingCountRef.current = 0;

    const formData = new FormData();
    formData.append("audio", file);

    try {
      const response = await fetch("http://localhost:8000/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.transcriptId) {
        setStatus("processing");
        setStatusMessage("File uploaded. Processing audio...");
        setProgress(30);
        checkTranscriptionStatus(data.transcriptId);
      } else {
        setStatus("error");
        setStatusMessage(data.message || "Upload failed");
        setProgress(0);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setStatus("error");
      setStatusMessage(`Upload error: ${error instanceof Error ? error.message : "Unknown error"}`);
      setProgress(0);
    }
  };

  const handleReset = () => {
    if (pollingTimeoutRef.current) {
      clearTimeout(pollingTimeoutRef.current);
    }
    setFile(null);
    setTranscript("");
    setStatus("idle");
    setStatusMessage("");
    setProgress(0);
    setMomStatus("idle");
    setMomResult("");
    pollingCountRef.current = 0;
  };

  const handleGenerateMOM = async () => {
    if (!transcript) return;

    setMomStatus("loading");
    try {
      const response = await fetch("http://localhost:8000/api/summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: transcript, type: "mom" }),
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
    transcript,
    status,
    statusMessage,
    progress,
    momStatus,
    momResult,
    handleFileChange,
    handleUpload,
    handleReset,
    handleGenerateMOM
  };
};

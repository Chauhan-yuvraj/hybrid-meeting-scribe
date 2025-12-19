import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

// Define a callback type for streaming updates
type ProgressCallback = (data: any) => void;

export const transcribeAudioStream = (filePath: string, onData: ProgressCallback): Promise<string> => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.resolve(__dirname, '../../python_core/transcribe.py');
    const venvPath = path.resolve(__dirname, '../../python_core/venv');
    
    // Correct Python path logic
    const isWindows = process.platform === "win32";
    const pythonPath = isWindows 
      ? path.join(venvPath, 'Scripts', 'python.exe')
      : path.join(venvPath, 'bin', 'python');

    const finalPythonPath = fs.existsSync(pythonPath) ? pythonPath : "python";

    const pythonProcess = spawn(finalPythonPath, [scriptPath, path.resolve(filePath)]);

    let fullTranscript = '';
    let buffer = '';

    // Handle data stream
    pythonProcess.stdout.on('data', (data) => {
      buffer += data.toString();
      
      const lines = buffer.split('\n');
      // The last line might be incomplete, so we keep it in the buffer
      buffer = lines.pop() || '';

      lines.forEach((line: string) => {
        if (!line.trim()) return; // Skip empty lines

        try {
          const jsonResult = JSON.parse(line);

          if (jsonResult.type === 'segment') {
            fullTranscript += jsonResult.text + " ";
            
            console.log(`Received segment: ${jsonResult.text.substring(0, 50)}...`); // Debug log
            // SEND UPDATE TO FRONTEND IMMEDIATELY
            onData(jsonResult); 
          } 
          else if (jsonResult.type === 'meta') {
            console.log(`Detected Language: ${jsonResult.language}`);
            onData(jsonResult); // Send meta to frontend too
          }
          else if (jsonResult.type === 'error') {
            console.error(jsonResult.message);
          }

        } catch (e) {
          console.error("JSON Parse Error:", e);
        }
      });
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Whisper Log: ${data}`);
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        resolve(fullTranscript.trim());
      } else {
        reject(new Error("Transcription failed"));
      }
    });
  });
};
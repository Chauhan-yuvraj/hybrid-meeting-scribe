import { spawn } from 'child_process';
import path from 'path';

const transcribeAudio = (filePath) => {
    return new Promise((resolve, reject) => {
        // Path to python script and virtual env python executable
        const scriptPath = path.join(__dirname, '../python_core/transcribe.py');
        const pythonPath = path.join(__dirname, '../python_core/venv/bin/python'); // Adjust for Windows if needed

        const pythonProcess = spawn(pythonPath, [scriptPath, filePath]);

        let dataString = '';
        let errorString = '';

        pythonProcess.stdout.on('data', (data) => {
            dataString += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            errorString += data.toString();
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                return reject(new Error(`Python process failed: ${errorString}`));
            }
            try {
                const result = JSON.parse(dataString);
                if (result.error) reject(new Error(result.error));
                else resolve(result);
            } catch (e) {
                reject(new Error("Failed to parse Python output"));
            }
        });
    });
};

module.exports = { transcribeAudio };
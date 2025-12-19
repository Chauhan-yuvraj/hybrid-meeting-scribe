import React, { useState } from "react";
import { UploadCloud, FileAudio, X } from "lucide-react";
import { formatFileSize, validateFile } from "../utils/fileHelpers";
import { cn } from "../lib/utils";

interface FileUploaderProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
  disabled: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({ file, onFileSelect, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSet(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      validateAndSet(event.target.files[0]);
    }
  };

  const validateAndSet = (selectedFile: File) => {
    const { valid, error } = validateFile(selectedFile);
    if (valid) {
      onFileSelect(selectedFile);
    } else {
      alert(error);
    }
  };

  if (file) {
    return (
      <div className="relative w-full p-4 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2">
        <div className="p-3 bg-white rounded-xl shadow-sm">
          <FileAudio className="w-8 h-8 text-indigo-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate">{file.name}</p>
          <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
        </div>
        {!disabled && (
          <button 
            onClick={() => onFileSelect(null)}
            className="p-2 hover:bg-indigo-100 rounded-full text-indigo-400 hover:text-indigo-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      <label
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={cn(
          "relative flex flex-col items-center justify-center w-full h-64 rounded-3xl border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden group",
          isDragging 
            ? "border-indigo-500 bg-indigo-50/50 scale-[1.02]" 
            : "border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50",
          disabled && "opacity-50 cursor-not-allowed pointer-events-none bg-slate-50"
        )}
      >
        <div className="relative z-10 flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
          <div className={cn(
            "p-4 rounded-full mb-4 transition-transform duration-300 group-hover:scale-110",
            isDragging ? "bg-indigo-100" : "bg-slate-100"
          )}>
            <UploadCloud className={cn(
              "w-8 h-8",
              isDragging ? "text-indigo-600" : "text-slate-400"
            )} />
          </div>
          <p className="mb-2 text-lg font-medium text-slate-700">
            <span className="text-indigo-600">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Supported formats: MP3, WAV, M4A, OGG (Max 100MB)
          </p>
        </div>
        <input 
          type="file" 
          className="hidden" 
          accept="audio/*"
          onChange={handleChange}
          disabled={disabled} 
        />
        
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 z-0 opacity-[0.03] bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]" />
      </label>
    </div>
  );
};

export default FileUploader;
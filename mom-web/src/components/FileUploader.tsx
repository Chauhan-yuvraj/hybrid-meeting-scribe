import React, { useState } from "react";
import { UploadCloud, FileAudio, X } from "lucide-react";
import { formatFileSize, validateFile } from "../utils/fileHelpers";
import { cn } from "../lib/utils";

interface FileUploaderProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
  disabled: boolean;
  isIncognito?: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({ file, onFileSelect, disabled, isIncognito }) => {
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
      <div className={cn(
        "relative w-full p-4 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2 border transition-all duration-500",
        isIncognito 
          ? "glass-dark border-emerald-900/30 shadow-[0_0_30px_-10px_rgba(16,185,129,0.1)]" 
          : "glass border-white/40 shadow-xl shadow-indigo-500/5"
      )}>
        <div className={cn(
          "p-3 rounded-xl shadow-sm transition-colors duration-500",
          isIncognito ? "bg-slate-800/50" : "bg-white/80"
        )}>
          <FileAudio className={cn(
            "w-8 h-8 transition-colors duration-500",
            isIncognito ? "text-emerald-500" : "text-indigo-600"
          )} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn(
            "text-sm font-semibold truncate transition-colors duration-500",
            isIncognito ? "text-slate-200" : "text-slate-900"
          )}>{file.name}</p>
          <p className={cn(
            "text-xs transition-colors duration-500",
            isIncognito ? "text-slate-500" : "text-slate-500"
          )}>{formatFileSize(file.size)}</p>
        </div>
        {!disabled && (
          <button 
            onClick={() => onFileSelect(null)}
            className={cn(
              "p-2 rounded-full transition-colors duration-300",
              isIncognito 
                ? "hover:bg-slate-800 text-slate-500 hover:text-emerald-500" 
                : "hover:bg-indigo-50 text-indigo-400 hover:text-indigo-700"
            )}
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
          "relative flex flex-col items-center justify-center w-full h-64 rounded-3xl border-2 border-dashed transition-all duration-500 cursor-pointer overflow-hidden group",
          isIncognito 
            ? [
                "glass-dark",
                isDragging ? "border-emerald-500 bg-emerald-900/10 shadow-[0_0_50px_-10px_rgba(16,185,129,0.2)]" : "border-slate-700 hover:border-emerald-500/30 hover:bg-slate-800/50"
              ]
            : [
                "glass",
                isDragging ? "border-indigo-500 bg-indigo-50/50 shadow-[0_0_50px_-10px_rgba(99,102,241,0.2)]" : "border-slate-200/60 hover:border-indigo-300 hover:bg-white/60"
              ],
          disabled && "opacity-50 cursor-not-allowed pointer-events-none"
        )}
      >
        <div className="relative z-10 flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
          <div className={cn(
            "p-4 rounded-full mb-4 transition-all duration-500 group-hover:scale-110 shadow-lg",
            isIncognito 
              ? (isDragging ? "bg-emerald-900/30 shadow-emerald-900/20" : "bg-slate-800 shadow-black/20") 
              : (isDragging ? "bg-indigo-100 shadow-indigo-200/50" : "bg-white shadow-indigo-100/50")
          )}>
            <UploadCloud className={cn(
              "w-8 h-8 transition-colors duration-500",
              isIncognito 
                ? (isDragging ? "text-emerald-400" : "text-slate-500 group-hover:text-emerald-500") 
                : (isDragging ? "text-indigo-600" : "text-slate-400 group-hover:text-indigo-600")
            )} />
          </div>
          <p className={cn(
            "mb-2 text-lg font-medium transition-colors duration-500",
            isIncognito ? "text-slate-300" : "text-slate-700"
          )}>
            <span className={cn(
              "transition-colors duration-500",
              isIncognito ? "text-emerald-400" : "text-indigo-600"
            )}>Click to upload</span> or drag and drop
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
        <div className={cn(
          "absolute inset-0 z-0 opacity-[0.03] [background-size:16px_16px] transition-colors duration-500",
          isIncognito 
            ? "bg-[radial-gradient(#10b981_1px,transparent_1px)]" 
            : "bg-[radial-gradient(#4f46e5_1px,transparent_1px)]"
        )} />
      </label>
    </div>
  );
};

export default FileUploader;
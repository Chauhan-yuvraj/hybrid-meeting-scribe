import React from "react";
import { Cloud, Lock } from "lucide-react";
import { cn } from "../lib/utils";

interface ModelSelectorProps {
  model: "gemini" | "whisper";
  setModel: (model: "gemini" | "whisper") => void;
  disabled?: boolean;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({ model, setModel, disabled }) => {
  const isIncognito = model === "whisper";

  return (
    <div className={cn(
      "flex p-1.5 rounded-2xl border transition-all duration-500",
      isIncognito 
        ? "bg-slate-950/50 border-slate-800 shadow-inner shadow-black/20" 
        : "bg-slate-100/50 border-slate-200 shadow-inner shadow-slate-200/50"
    )}>
      <button
        onClick={() => setModel("gemini")}
        disabled={disabled}
        className={cn(
          "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300",
          model === "gemini"
            ? "bg-white text-indigo-600 shadow-md shadow-indigo-100 ring-1 ring-black/5 scale-[1.02]"
            : isIncognito ? "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50" : "text-slate-500 hover:text-slate-700 hover:bg-white/50",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <Cloud className={cn("w-4 h-4", model === "gemini" && "animate-pulse")} />
        <span className="relative">
          Gemini Cloud
          {model === "gemini" && (
            <span className="absolute -top-1 -right-2 w-2 h-2 bg-indigo-500 rounded-full animate-ping" />
          )}
        </span>
      </button>
      <button
        onClick={() => setModel("whisper")}
        disabled={disabled}
        className={cn(
          "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300",
          model === "whisper"
            ? "bg-emerald-900/80 text-emerald-400 shadow-md shadow-emerald-900/20 ring-1 ring-emerald-500/20 scale-[1.02]"
            : isIncognito ? "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50" : "text-slate-500 hover:text-slate-700 hover:bg-white/50",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <Lock className={cn("w-4 h-4", model === "whisper" && "animate-pulse")} />
        <span className="relative">
          Local Whisper
          {model === "whisper" && (
            <span className="absolute -top-1 -right-2 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
          )}
        </span>
      </button>
    </div>
  );
};

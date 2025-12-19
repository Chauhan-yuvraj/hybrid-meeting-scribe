import React from "react";
import { CheckCircle2, Circle, Loader2, AlertCircle } from "lucide-react";
import { type ProcessStatus } from "../hooks/useAudioProcessing";
import { cn } from "../lib/utils";

interface StatusCardProps {
  status: ProcessStatus;
  progress: number;
  message: string;
  isIncognito?: boolean;
}

const StatusCard: React.FC<StatusCardProps> = ({ status, progress, message, isIncognito }) => {
  if (status === "idle") return null;

  const steps = [
    { id: "uploading", label: "Uploading" },
    { id: "processing", label: "Transcribing" },
    { id: "completed", label: "Ready" },
  ];

  const getCurrentStepIndex = () => {
    if (status === "uploading") return 0;
    if (status === "processing") return 1;
    if (status === "completed") return 3; // All done
    return 0;
  };

  const currentStep = getCurrentStepIndex();
  const isError = status === "error";

  return (
    <div className={cn(
      "w-full border rounded-2xl p-6 shadow-xl animate-in fade-in zoom-in-95 duration-300 transition-all",
      isIncognito 
        ? "glass-dark border-emerald-900/30 shadow-[0_0_30px_-10px_rgba(16,185,129,0.1)]" 
        : "glass border-white/40 shadow-xl shadow-indigo-500/5"
    )}>
      
      {/* Stepper Header */}
      <div className="flex justify-between items-center mb-8 relative">
        <div className={cn(
          "absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 -z-10 transition-colors",
          isIncognito ? "bg-slate-800" : "bg-slate-200/60"
        )} />
        
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          
          return (
            <div key={step.id} className={cn(
              "flex flex-col items-center gap-2 px-2 transition-colors rounded-lg",
              isIncognito ? "bg-slate-950" : "bg-white/80 backdrop-blur-sm"
            )}>
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg",
                isCompleted 
                  ? "bg-emerald-500 text-white scale-100 shadow-emerald-500/30" 
                  : isActive 
                    ? (isIncognito ? "bg-emerald-600 text-white scale-110 ring-4 ring-emerald-900/30 shadow-emerald-500/40" : "bg-indigo-600 text-white scale-110 ring-4 ring-indigo-100 shadow-indigo-500/40")
                    : (isIncognito ? "bg-slate-800 text-slate-600" : "bg-slate-100 text-slate-400")
              )}>
                {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : 
                 isActive ? <Loader2 className="w-4 h-4 animate-spin" /> : 
                 <Circle className="w-4 h-4" />}
              </div>
              <span className={cn(
                "text-xs font-bold uppercase tracking-wider transition-colors",
                (isActive || isCompleted) 
                  ? (isIncognito ? "text-emerald-400" : "text-indigo-900") 
                  : (isIncognito ? "text-slate-600" : "text-slate-400")
              )}>{step.label}</span>
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      {(status === "uploading" || status === "processing") && (
        <div className="space-y-3 mb-6">
          <div className={cn(
            "flex justify-between text-xs font-medium transition-colors",
            isIncognito ? "text-slate-400" : "text-slate-500"
          )}>
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className={cn(
            "w-full rounded-full h-2 overflow-hidden transition-colors",
            isIncognito ? "bg-slate-800" : "bg-slate-100"
          )}>
            <div
              className={cn(
                "h-2 rounded-full transition-all duration-300 ease-out relative overflow-hidden",
                isIncognito ? "bg-emerald-500" : "bg-indigo-600"
              )}
              style={{ width: `${progress}%` }}
            >
               <div className="absolute inset-0 bg-white/30 animate-[shimmer_2s_infinite]" />
            </div>
          </div>
        </div>
      )}

      {/* Status Message */}
      <div className={cn(
        "flex items-center gap-3 p-4 rounded-xl text-sm border transition-colors backdrop-blur-sm",
        isError 
          ? "bg-red-50/50 border-red-100 text-red-700" 
          : status === "completed" 
            ? (isIncognito ? "bg-emerald-900/20 border-emerald-900/50 text-emerald-400" : "bg-emerald-50/50 border-emerald-100 text-emerald-700")
            : (isIncognito ? "bg-slate-800/50 border-slate-700 text-slate-300" : "bg-slate-50/50 border-slate-100 text-slate-600")
      )}>
        {isError ? <AlertCircle className="w-5 h-5 shrink-0" /> : 
         status === "completed" ? <CheckCircle2 className="w-5 h-5 shrink-0" /> :
         <Loader2 className={cn(
           "w-5 h-5 shrink-0 animate-spin",
           isIncognito ? "text-emerald-500" : "text-indigo-500"
         )} />
        }
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
};

export default StatusCard;
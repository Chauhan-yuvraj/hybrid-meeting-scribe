import React from "react";
import { CheckCircle2, Circle, Loader2, AlertCircle } from "lucide-react";
import { type ProcessStatus } from "../hooks/useAudioProcessing";
import { cn } from "../lib/utils";

interface StatusCardProps {
  status: ProcessStatus;
  progress: number;
  message: string;
}

const StatusCard: React.FC<StatusCardProps> = ({ status, progress, message }) => {
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
    <div className="w-full bg-white border border-slate-100 rounded-2xl p-6 shadow-xl shadow-slate-200/50 animate-in fade-in zoom-in-95 duration-300">
      
      {/* Stepper Header */}
      <div className="flex justify-between items-center mb-8 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-slate-100 -z-10" />
        
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          
          return (
            <div key={step.id} className="flex flex-col items-center gap-2 bg-white px-2">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500",
                isCompleted ? "bg-emerald-500 text-white scale-100" :
                isActive ? "bg-indigo-600 text-white scale-110 ring-4 ring-indigo-100" :
                "bg-slate-100 text-slate-400"
              )}>
                {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : 
                 isActive ? <Loader2 className="w-4 h-4 animate-spin" /> : 
                 <Circle className="w-4 h-4" />}
              </div>
              <span className={cn(
                "text-xs font-medium uppercase tracking-wider",
                (isActive || isCompleted) ? "text-slate-800" : "text-slate-400"
              )}>{step.label}</span>
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      {(status === "uploading" || status === "processing") && (
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-xs font-medium text-slate-500">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300 ease-out relative"
              style={{ width: `${progress}%` }}
            >
               <div className="absolute inset-0 bg-white/30 animate-[shimmer_2s_infinite]" />
            </div>
          </div>
        </div>
      )}

      {/* Status Message */}
      <div className={cn(
        "flex items-center gap-3 p-4 rounded-xl text-sm border",
        isError ? "bg-red-50 border-red-100 text-red-700" : 
        status === "completed" ? "bg-emerald-50 border-emerald-100 text-emerald-700" :
        "bg-slate-50 border-slate-100 text-slate-600"
      )}>
        {isError ? <AlertCircle className="w-5 h-5 shrink-0" /> : 
         status === "completed" ? <CheckCircle2 className="w-5 h-5 shrink-0" /> :
         <Loader2 className="w-5 h-5 shrink-0 animate-spin text-indigo-500" />
        }
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
};

export default StatusCard;
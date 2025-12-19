import React from "react";
import { Copy, Check, FileText, ShieldCheck } from "lucide-react";
import { Button } from "./ui/Button";
import { cn } from "../lib/utils";

interface ResultCardProps {
  title: string;
  type: "transcript" | "mom";
  content: string;
  onCopy: () => void;
  actionButton?: React.ReactNode;
  isIncognito?: boolean;
}

const ResultCard: React.FC<ResultCardProps> = ({
  title,
  type,
  content,
  onCopy,
  actionButton,
  isIncognito,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn(
      "w-full rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 border transition-all duration-500",
      isIncognito 
        ? "glass-dark border-emerald-900/30 shadow-[0_0_30px_-10px_rgba(16,185,129,0.1)]" 
        : "glass border-white/40 shadow-xl shadow-indigo-500/5"
    )}>
      {/* Card Header */}
      <div className={cn(
        "px-6 py-4 border-b flex flex-wrap items-center justify-between gap-4 backdrop-blur-md transition-colors duration-500",
        isIncognito 
          ? "bg-slate-900/50 border-slate-800" 
          : "bg-white/50 border-slate-100"
      )}>
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-lg transition-colors duration-500 shadow-sm",
            isIncognito 
              ? "bg-emerald-900/30 text-emerald-400 shadow-emerald-900/20" 
              : (type === "transcript" ? "bg-blue-100 text-blue-600 shadow-blue-100" : "bg-violet-100 text-violet-600 shadow-violet-100")
          )}>
            {isIncognito ? <ShieldCheck className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
          </div>
          <h2 className={cn(
            "font-bold transition-colors duration-500",
            isIncognito ? "text-slate-200" : "text-slate-800"
          )}>{title}</h2>
        </div>
        
        <div className="flex items-center gap-2">
          {actionButton}
          <Button 
            variant="secondary" 
            onClick={handleCopy}
            className={cn(
              "px-3 py-2 text-xs h-9 transition-colors duration-500",
              isIncognito 
                ? "bg-slate-800 text-slate-300 hover:bg-slate-700 border-slate-700" 
                : "bg-white/80 hover:bg-white"
            )}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-500" /> Copied
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 mr-1.5" /> Copy
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className={cn(
        "p-6 md:p-8 max-h-[600px] overflow-y-auto custom-scrollbar transition-colors duration-500",
        isIncognito ? "bg-slate-900/30" : "bg-white/40"
      )}>
        <div className={cn(
          "prose max-w-none prose-p:leading-relaxed transition-colors duration-500",
          isIncognito ? "prose-invert prose-p:text-slate-300 prose-headings:text-slate-100" : "prose-slate prose-p:text-slate-600 prose-headings:text-slate-800"
        )}>
          <p className="whitespace-pre-wrap text-sm md:text-base font-normal">
            {content}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
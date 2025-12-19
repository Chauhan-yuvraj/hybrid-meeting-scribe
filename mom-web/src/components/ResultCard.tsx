import React from "react";
import { Copy, Check, FileText } from "lucide-react";
import { Button } from "./ui/Button";
import { cn } from "../lib/utils";

interface ResultCardProps {
  title: string;
  type: "transcript" | "mom";
  content: string;
  onCopy: () => void;
  actionButton?: React.ReactNode;
}

const ResultCard: React.FC<ResultCardProps> = ({
  title,
  type,
  content,
  onCopy,
  actionButton,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/60 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
      {/* Card Header */}
      <div className="bg-slate-50/80 backdrop-blur-sm px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-lg",
            type === "transcript" ? "bg-blue-100 text-blue-600" : "bg-violet-100 text-violet-600"
          )}>
            <FileText className="w-5 h-5" />
          </div>
          <h2 className="font-bold text-slate-800">{title}</h2>
        </div>
        
        <div className="flex items-center gap-2">
          {actionButton}
          <Button 
            variant="secondary" 
            onClick={handleCopy}
            className="px-3 py-2 text-xs h-9"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1.5" /> Copied
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
      <div className="p-6 md:p-8 max-h-[600px] overflow-y-auto custom-scrollbar bg-white">
        <div className="prose prose-slate max-w-none prose-p:leading-relaxed prose-headings:text-slate-800 prose-a:text-indigo-600">
          <p className="whitespace-pre-wrap text-slate-600 text-sm md:text-base font-normal">
            {content}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
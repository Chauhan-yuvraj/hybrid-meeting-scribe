import React from "react";

interface StatusIndicatorProps {
  status: "idle" | "uploading" | "processing" | "completed" | "error";
  statusMessage: string;
  progress: number;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, statusMessage, progress }) => {
  if (status === "idle") return null;

  return (
    <div className="space-y-3 pt-2">
      {(status === "uploading" || status === "processing") && (
        <>
          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-center space-x-3 text-indigo-600">
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-sm font-medium">{statusMessage}</span>
          </div>
        </>
      )}

      {status === "error" && (
        <div className="flex items-start space-x-2 text-red-600 bg-red-50 px-4 py-3 rounded-lg border border-red-200 animate-fade-in">
          <svg className="w-5 h-5 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
          </svg>
          <span className="text-sm">{statusMessage}</span>
        </div>
      )}

      {status === "completed" && (
        <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-4 py-3 rounded-lg border border-green-200 animate-fade-in">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
          </svg>
          <span className="text-sm font-medium">{statusMessage}</span>
        </div>
      )}
    </div>
  );
};

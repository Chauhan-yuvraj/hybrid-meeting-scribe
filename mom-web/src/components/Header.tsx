import { Mic, Shield, Lock } from "lucide-react";

interface HeaderProps {
  isIncognito?: boolean;
}

const Header = ({ isIncognito }: HeaderProps) => (
  <header className="text-center space-y-6 max-w-2xl transition-all duration-500">
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border shadow-sm mb-2 transition-colors duration-500 ${
      isIncognito 
        ? "bg-slate-900 border-emerald-900/50 shadow-emerald-900/20" 
        : "bg-white border-indigo-100"
    }`}>
      <span className={`flex h-2 w-2 rounded-full animate-pulse ${
        isIncognito ? "bg-emerald-500" : "bg-indigo-500"
      }`}></span>
      <span className={`text-xs font-semibold uppercase tracking-wide ${
        isIncognito ? "text-emerald-400" : "text-indigo-700"
      }`}>
        {isIncognito ? "Secure Local Mode" : "AI Powered"}
      </span>
    </div>
    
    <div className="relative inline-block">
      <div className={`absolute -inset-1 rounded-full blur opacity-20 transition-colors duration-500 ${
        isIncognito 
          ? "bg-gradient-to-r from-emerald-500 to-teal-500" 
          : "bg-gradient-to-r from-indigo-500 to-violet-500"
      }`}></div>
      <div className={`relative p-4 rounded-2xl shadow-xl ring-1 transition-colors duration-500 ${
        isIncognito 
          ? "bg-slate-900 ring-slate-800" 
          : "bg-white ring-slate-900/5"
      }`}>
        {isIncognito ? (
          <Shield className="w-8 h-8 text-emerald-500" />
        ) : (
          <Mic className="w-8 h-8 text-indigo-600" />
        )}
      </div>
    </div>

    <div className="space-y-2">
      <h1 className={`text-4xl md:text-6xl font-extrabold tracking-tight transition-colors duration-500 ${
        isIncognito ? "text-slate-100 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]" : "text-slate-900"
      }`}>
        Meeting <span className={`text-transparent bg-clip-text bg-gradient-to-r ${
          isIncognito 
            ? "from-emerald-400 via-teal-300 to-emerald-500 animate-pulse" 
            : "from-indigo-600 via-violet-600 to-indigo-600"
        }`}>Assistant</span>
      </h1>
      <p className={`text-lg md:text-xl leading-relaxed transition-colors duration-500 max-w-xl mx-auto ${
        isIncognito ? "text-slate-400" : "text-slate-600"
      }`}>
        {isIncognito 
          ? "Private, offline transcription running locally on your device."
          : "Upload your meeting audio to instantly generate accurate transcripts and structured minutes of meeting."
        }
      </p>
    </div>
  </header>
);

export default Header;